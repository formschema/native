import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';

import {
  ArrayField,
  ArrayDescriptor,
  AbstractParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  ArrayItemField
} from '@/types';

export class ArrayParser extends AbstractParser<any, ArrayDescriptor, ArrayField> {
  protected readonly items: JsonSchema[] = [];
  protected readonly additionalItems: JsonSchema[] = [];

  public get kind(): FieldKind {
    return 'array';
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

    const options: AbstractParserOptions<unknown, AbstractUISchemaDescriptor> = {
      schema: itemSchema,
      model: itemModel,
      descriptor: itemDescriptor,
      descriptorConstructor: this.options.descriptorConstructor,
      name: this.name,
      $forceUpdate: this.options.$forceUpdate
    };

    const parser: any | null = Parser.get(options, this);

    if (parser) {
      parser.field.index = index;

      if (itemDescriptor.kind === 'checkbox') {
        parser.field.attrs.input.name = `${this.field.attrs.input.name}[]`;
        parser.field.attrs.input.type = 'checkbox';
        parser.field.attrs.input.checked = typeof this.model[index] !== 'undefined'
          && itemSchema.default === this.model[index];
      }

      return parser.field;
    }

    return null;
  }

  protected getFieldIndex(index: number) {
    const itemSchema = this.schema.items instanceof Array || this.field.uniqueItems
      ? this.items[index]
      : this.items[0];

    return this.getFieldItem(itemSchema, index);
  }

  public parse() {
    super.parse();

    if (this.schema.items) {
      if (this.schema.items instanceof Array) {
        this.items.push(...this.schema.items);
      } else {
        this.items.push(this.schema.items);
      }
    } else {
      this.items.push({ type: 'string' });
    }

    if (this.schema.additionalItems) {
      const additionalItems = this.schema.additionalItems as JsonSchema;

      if (!Objects.isEmpty(additionalItems)) {
        this.additionalItems.push(additionalItems);
      }
    }

    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    let count = this.model.length || this.field.minItems;

    if (this.schema.uniqueItems === true && this.items.length === 1) {
      const itemSchema = this.items[0];

      if (itemSchema.enum instanceof Array) {
        this.field.uniqueItems = true;
        this.field.maxItems = itemSchema.enum.length;
        count = this.field.maxItems;

        this.items.splice(0);
        itemSchema.enum.forEach((value) => this.items.push({
          ...itemSchema,
          default: value,
          title: `${value}`
        }));
      }
    }

    if (typeof this.schema.maxItems === 'number') {
      this.field.max = this.field.maxItems as any;
    } else if (this.schema.items instanceof Array) {
      this.field.max = this.items.length + this.additionalItems.length;
    } else {
      this.field.max = -1;
    }

    const generateFields = () => {
      const limit = count < this.field.max || this.field.max === -1
        ? count
        : this.field.maxItems || this.items.length;

      const fields = Array(...Array(limit))
        .map((x, index) => this.getFieldIndex(index))
        .filter((field) => field !== null) as ArrayItemField[];

      if (limit < count) {
        const index = count;
        const itemSchema = this.additionalItems[0];
        const additionalField = this.getFieldItem(itemSchema, index);

        if (additionalField) {
          fields.push(additionalField);
        }
      }

      return fields;
    };

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

    this.field.children = generateFields();

    if (!this.field.uniqueItems) {
      this.field.children.forEach(({ model }, index) => {
        if (index > this.model.length - 1) {
          this.model.push(model);
        }
      });
    }

    Object.defineProperty(this.field, 'count', {
      enumerable: true,
      get: () => {
        return count;
      },
      set: (value: number) => {
        count = value;

        this.model.push(undefined);

        this.field.children = generateFields();

        this.options.$forceUpdate();
      }
    });
  }

  protected getModelValue(): unknown[] {
    return this.model.filter((item: unknown) => typeof item !== 'undefined');
  }

  protected parseValue(data: unknown[]): unknown[] {
    return data instanceof Array ? data : [];
  }
}
