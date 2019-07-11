import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';

import {
  ArrayField,
  ArrayDescriptor,
  ParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  ArrayItemField,
  IArrayParser
} from '@/types';

export class ArrayParser extends Parser<any, ArrayDescriptor, ArrayField> implements IArrayParser {
  readonly items: JsonSchema[] = [];
  additionalItems?: JsonSchema;
  minItems: number = 0;
  maxItems?: number;
  max: number = -1;
  count: number = 0;

  get kind(): FieldKind {
    return 'array';
  }

  get limit(): number {
    if (this.field.uniqueItems || this.items.length === 0) {
      return this.items.length;
    }

    if (this.count < this.minItems || !Array.isArray(this.schema.items)) {
      return this.count;
    }

    return this.count < this.items.length
      ? this.count
      : this.items.length;
  }

  get children(): ArrayItemField[] {
    const limit = this.limit;
    const fields = Array(...Array(limit))
      .map((x, index) => this.getFieldIndex(index))
      .filter((field) => field !== null) as ArrayItemField[];

    if (limit < this.count && this.additionalItems) {
      let index = limit;

      do {
        const additionalField = this.getFieldItem(this.additionalItems, index);

        if (additionalField === null) {
          break;
        }

        fields.push(additionalField);
      } while (++index < this.count);
    }

    return fields;
  }

  getFieldItem(itemSchema: JsonSchema, index: number): ArrayItemField | null {
    const kind: FieldKind | undefined = this.field.uniqueItems ? 'checkbox' : undefined;
    const defaultDescriptor = this.options.descriptorConstructor(itemSchema, kind);

    const itemDescriptor = this.field.descriptor.items
      ? this.field.descriptor.items[index] || defaultDescriptor
      : defaultDescriptor;

    const itemModel = typeof this.model[index] !== 'undefined'
      ? this.model[index]
      : itemSchema.default;

    const options: ParserOptions<unknown, AbstractUISchemaDescriptor> = {
      schema: itemSchema,
      model: itemModel,
      descriptor: itemDescriptor,
      descriptorConstructor: this.options.descriptorConstructor,
      name: !this.isRoot && this.options.name ? `${this.options.name}[]` : this.options.name
    };

    if (this.rawValue.length <= index) {
      this.rawValue.push(undefined);
    }

    const parser = Parser.get(options, this);

    // set the onChange option after the parser initialization
    // to prevent first field value emit
    options.onChange = (value) => {
      this.rawValue[index] = value;

      this.model.splice(0);
      this.model.push(...this.parseValue(this.rawValue) as any);

      this.commit();
    };

    if (parser) {
      if (itemDescriptor.kind === 'checkbox') {
        this.parseCheckboxField(parser, itemModel);
      }

      return parser.field as any;
    }

    return null;
  }

  getFieldIndex(index: number) {
    const itemSchema = this.schema.items instanceof Array || this.field.uniqueItems
      ? this.items[index]
      : this.items[0];

    return this.getFieldItem(itemSchema, index);
  }

  setCount(value: number) {
    if (this.maxItems && value > this.maxItems) {
      return;
    }

    this.count = value;
    this.field.children = this.children;

    // initialize the array model
    this.field.children.forEach((field) => field.setValue(field.value));
  }

  parse() {
    super.parse();

    if (this.schema.items) {
      if (this.schema.items instanceof Array) {
        this.items.push(...this.schema.items);

        if (this.schema.additionalItems && !Objects.isEmpty(this.schema.additionalItems)) {
          this.additionalItems = this.schema.additionalItems;
        }
      } else {
        this.items.push(this.schema.items);
      }
    }

    this.maxItems = this.schema.maxItems;
    this.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    const self = this;

    this.field.buttons = {
      add: {
        get disabled() {
          return self.count === self.max || self.items.length === 0;
        },
        push: () => this.setCount(this.count + 1)
      }
    };

    this.count = this.minItems > this.model.length
      ? this.minItems
      : this.model.length;

    this.parseUniqueItems();
    this.setCount(this.count);
    this.commit();
  }

  parseCheckboxField(parser: any, itemModel: unknown) {
    const checked = typeof itemModel !== 'undefined' && this.rawValue.includes(itemModel);

    parser.field.attrs.input.type = 'checkbox';

    parser.setValue = (checked: boolean) => {
      parser.rawValue = checked;
      parser.model = checked ? itemModel : undefined;
      parser.field.attrs.input.checked = checked;
    };

    parser.setValue(checked);
  }

  parseUniqueItems() {
    if (this.schema.uniqueItems === true && this.items.length === 1) {
      const itemSchema = this.items[0];

      if (itemSchema.enum instanceof Array) {
        this.field.uniqueItems = true;
        this.maxItems = itemSchema.enum.length;
        this.count = this.maxItems;

        this.items.splice(0);
        itemSchema.enum.forEach((value) => this.items.push({
          ...itemSchema,
          enum: undefined,
          default: value,
          title: `${value}`
        }));

        this.max = this.items.length;
      } else {
        this.max = this.maxItems || this.items.length;
      }
    } else if (this.maxItems) {
      this.max = this.maxItems;
    } else if (this.schema.items instanceof Array) {
      this.max = this.additionalItems ? -1 : this.items.length;
    } else {
      this.max = -2;
    }

    if (this.field.uniqueItems) {
      const values: unknown[] = [];

      this.items.forEach((itemSchema) => {
        if (this.model.includes(itemSchema.default)) {
          values.push(itemSchema.default);
        } else {
          values.push(undefined);
        }
      });

      this.model.splice(0);
      this.model.push(...values);
    }
  }

  parseValue(data: unknown[]): unknown[] {
    return data instanceof Array
      ? data.filter((item) => typeof item !== 'undefined')
      : [];
  }
}

Parser.register('array', ArrayParser);
