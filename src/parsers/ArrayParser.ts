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
  protected readonly items: any[] = [];
  protected readonly additionalItems: any[] = [];
  protected fields: ArrayItemField[] = [];

  public get kind(): FieldKind {
    return 'array';
  }

  protected getFieldItem(itemSchema: JsonSchema, index: number): ArrayItemField | null {
    const defaultDescriptor = this.options.descriptorConstructor(itemSchema);

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

      return parser.field;
    }

    return null;
  }

  protected getFieldIndex(index: number) {
    const itemSchema = this.schema.items instanceof Array
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

    this.field.uniqueItems = this.schema.uniqueItems === true;
    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    const total = this.items.length + this.additionalItems.length;
    let count = this.field.minItems || this.model.length;

    this.field.max = this.field.maxItems ? this.field.maxItems : total;

    if (this.field.max < this.field.minItems) {
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

    this.field.getFields = () => {
      return this.fields;
    };

    this.fields = generateFields();

    Object.defineProperty(this.field, 'count', {
      enumerable: true,
      get: () => {
        return count;
      },
      set: (value: number) => {
        count = value;

        this.model.push(undefined);

        this.fields = generateFields();

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
