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

  public get kind(): FieldKind {
    return 'array';
  }

  protected get fields() {
    return this.getFields(this.items);
  }

  protected get additionalFields() {
    return this.getFields(this.additionalItems);
  }

  protected getFields(items: JsonSchema[]): ArrayItemField[] {
    return items
      .map((itemSchema, i) => this.getFieldItem(itemSchema, i))
      .filter((field) => field !== null) as ArrayItemField[];
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
        this.additionalItems.push(this.additionalItems);
      }
    }

    const total = this.items.length + this.additionalFields.length;

    this.field.uniqueItems = this.schema.uniqueItems === true;
    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    this.field.max = this.field.maxItems ? this.field.maxItems : total;

    if (this.field.max < this.field.minItems) {
      this.field.max = -1;
    }

    this.field.getFieldItem = (index) => {
      const itemSchema = this.schema.items instanceof Array
        ? this.items[index]
        : this.items[0];

      return this.getFieldItem(itemSchema, index);
    };

    this.field.getAdditionalFieldItem = () => {
      if (this.additionalItems.length === 0) {
        return null;
      }

      const itemSchema = this.additionalItems[0];
      const index = this.field.count;

      return this.getFieldItem(itemSchema, index);
    };

    let count = this.field.minItems || this.field.model.length;

    Object.defineProperty(this.field, 'count', {
      enumerable: true,
      get: () => {
        return count;
      },
      set: (value: number) => {
        count = value;

        this.model.push(undefined);

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
