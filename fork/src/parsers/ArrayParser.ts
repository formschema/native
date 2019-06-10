import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';

import {
  ArrayField,
  ArrayDescriptor,
  AbstractParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  ItemField
} from '@/types';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';

export class ArrayParser extends AbstractParser<any, ArrayDescriptor, ArrayField> {
  readonly items: any[] = [];
  readonly additionalItems: any[] = [];

  get kind(): FieldKind {
    return 'array';
  }

  get fields() {
    return this.getFields(this.items);
  }

  get additionalFields() {
    return this.getFields(this.additionalItems);
  }

  getFields(items: JsonSchema[]): ItemField[] {
    return items.map((itemSchema) => {
      const options: AbstractParserOptions<any, AbstractUISchemaDescriptor> = {
        schema: itemSchema,
        model: itemSchema.default,
        descriptor: this.options.descriptorConstructor(itemSchema),
        descriptorConstructor: this.options.descriptorConstructor,
        name: this.name
      };

      const parser = Parser.get(options, this);
      const field: ItemField = parser.field as any;

      return field as any;
    });
  }

  parse() {
    if (this.schema.items) {
      if (this.schema.items instanceof Array) {
        this.items.push(...this.schema.items);
      } else {
        this.items.push(this.schema.items);
      }
    }

    if (this.schema.additionalItems) {
      const additionalItems: JsonSchema = this.schema.additionalItems as any;

      if (!Objects.isEmpty(additionalItems)) {
        this.additionalItems.push(this.schema.additionalItems);
      }
    }

    this.parseField();
  }

  parseField() {
    super.parseField();

    this.field.items = this.fields;
    this.field.labels = this.field.items.map(({ descriptor }, i) => descriptor.label || `Item ${i}`);
    this.field.additionalItems = this.additionalFields;
    this.field.additionalLabels = this.field.additionalItems.map(({ descriptor }, i) => descriptor.label || `Item ${i}`);
    this.field.uniqueItems = this.schema.uniqueItems === true;
    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    this.field.count = this.field.minItems;
  }

  parseValue(data: any): string {
    return typeof data !== 'undefined' ? data : '';
  }
}
