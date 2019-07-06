import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';

import {
  ArrayField,
  ArrayDescriptor,
  ParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  ArrayItemField
} from '@/types';

export class ArrayParser extends Parser<any, ArrayDescriptor, ArrayField> {
  protected readonly items: JsonSchema[] = [];
  protected additionalItems?: JsonSchema;
  protected count: number = 0;

  public get kind(): FieldKind {
    return 'array';
  }

  protected get limit(): number {
    if (this.field.uniqueItems || this.items.length === 0) {
      return this.items.length;
    }

    if (this.count < this.field.minItems || !Array.isArray(this.schema.items)) {
      return this.count;
    }

    return this.count < this.items.length
      ? this.count
      : this.items.length;
  }

  protected get children(): ArrayItemField[] {
    const limit = this.limit;
    const fields = Array(...Array(limit))
      .map((x, index) => this.getFieldIndex(index))
      .filter((field) => field !== null) as ArrayItemField[];

    if (limit < this.count && this.additionalItems) {
      let index = limit;

      do {
        const additionalField = this.getFieldItem(this.additionalItems, index);

        if (!additionalField) {
          break;
        }

        fields.push(additionalField);
      } while (++index < this.count);
    }

    return fields;
  }

  protected getFieldItem(itemSchema: JsonSchema, index: number): ArrayItemField | null {
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
      name: this.name
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

  protected getFieldIndex(index: number) {
    const itemSchema = this.schema.items instanceof Array || this.field.uniqueItems
      ? this.items[index]
      : this.items[0];

    return this.getFieldItem(itemSchema, index);
  }

  protected setCount(value: number) {
    if (this.field.maxItems && value > this.field.maxItems) {
      return;
    }

    this.count = value;
    this.field.children = this.children;

    // initialize the array model
    this.field.children.forEach((field) => field.setValue(field.value));

    this.commit();
  }

  public parse() {
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

    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    const self = this;

    this.field.buttons = {
      add: {
        get disabled() {
          return self.field.count === self.field.max;
        },
        push: () => this.setCount(this.field.count + 1)
      }
    };

    this.count = this.field.minItems > this.model.length
      ? this.field.minItems
      : this.model.length;

    Object.defineProperty(this.field, 'count', {
      enumerable: true,
      get: () => this.count
    });

    this.parseUniqueItems();
    this.setCount(this.count);
  }

  protected parseCheckboxField(parser: any, itemModel: unknown) {
    const checked = typeof itemModel !== 'undefined' && this.rawValue.includes(itemModel);

    parser.field.attrs.input.name = `${this.field.attrs.input.name}[]`;
    parser.field.attrs.input.type = 'checkbox';

    parser.setValue = (checked: boolean) => {
      parser.rawValue = checked;
      parser.model = checked ? itemModel : undefined;
      parser.field.attrs.input.checked = checked;
    };

    parser.setValue(checked);
  }

  protected parseUniqueItems() {
    if (this.schema.uniqueItems === true && this.items.length === 1) {
      const itemSchema = this.items[0];

      if (itemSchema.enum instanceof Array) {
        this.field.uniqueItems = true;
        this.field.maxItems = itemSchema.enum.length;
        this.count = this.field.maxItems;

        this.items.splice(0);
        itemSchema.enum.forEach((value) => this.items.push({
          ...itemSchema,
          default: value,
          title: `${value}`
        }));

        this.field.max = this.items.length;
      } else {
        this.field.max = this.field.maxItems || this.items.length;
      }
    } else if (this.field.maxItems) {
      this.field.max = this.field.maxItems;
    } else if (this.schema.items instanceof Array) {
      this.field.max = this.additionalItems ? -1 : this.items.length;
    } else {
      this.field.max = -2;
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

  protected parseValue(data: unknown[]): unknown[] {
    return data instanceof Array
      ? data.filter((item) => typeof item !== 'undefined')
      : [];
  }
}

Parser.register('array', ArrayParser);
