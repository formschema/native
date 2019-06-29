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
      .map((itemSchema, i): AbstractParserOptions<unknown, AbstractUISchemaDescriptor> => {
        const defaultDescriptor = this.options.descriptorConstructor(itemSchema);
        const itemDescriptor = this.field.descriptor.items
          ? this.field.descriptor.items[i] || defaultDescriptor
          : defaultDescriptor;

        return {
          schema: itemSchema,
          model: typeof this.model[i] !== 'undefined' ? this.model[i] : itemSchema.default,
          descriptor: itemDescriptor,
          descriptorConstructor: this.options.descriptorConstructor,
          name: this.name,
          $forceUpdate: this.options.$forceUpdate
        };
      })
      .map((options) => Parser.get(options, this))
      .filter((parser) => parser instanceof AbstractParser)
      .map((parser: any) => parser.field as ArrayItemField);
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

    this.field.definedAsObject = !Array.isArray(this.schema.items);
    this.field.items = this.fields;
    this.field.additionalItems = this.additionalFields;
    this.field.additionalLabels = this.field.additionalItems.map(({ descriptor }, i) => descriptor.label || `Item ${i}`);
    this.field.uniqueItems = this.schema.uniqueItems === true;
    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    let count = this.field.minItems || this.field.model.length;

    this.field.total = this.field.items.length + this.field.additionalItems.length;
    this.field.max = this.field.maxItems ? this.field.maxItems : this.field.total;

    if (this.field.max < this.field.minItems) {
      this.field.max = -1;
      this.field.total = -1;
    }

    Object.defineProperty(this.field, 'count', {
      enumerable: true,
      get: () => {
        return count;
      },
      set: (value: number) => {
        count = value;

        this.options.$forceUpdate();
      }
    });
  }

  protected parseValue(data: unknown[]): unknown[] {
    return data instanceof Array ? data : [];
  }
}
