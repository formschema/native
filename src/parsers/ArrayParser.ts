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

  getFields(items: JsonSchema[]): ArrayItemField[] {
    return items.map((itemSchema, i) => {
      const defaultDescriptor = this.options.descriptorConstructor(itemSchema);
      const itemDescriptor = this.field.descriptor.items
        ? this.field.descriptor.items[i] || defaultDescriptor
        : defaultDescriptor;

      const options: AbstractParserOptions<any, AbstractUISchemaDescriptor> = {
        schema: itemSchema,
        model: this.model[i] !== void(0) ? this.model[i] : itemSchema.default,
        descriptor: itemDescriptor,
        descriptorConstructor: this.options.descriptorConstructor,
        name: this.name,
        $vue: this.options.$vue
      };

      const parser = Parser.get(options, this);
      const field: ArrayItemField = parser.field as any;

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
    } else {
      this.items.push({ type: 'string' });
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

    this.field.definedAsObject = !Array.isArray(this.schema.items);
    this.field.items = this.fields;
    this.field.model = this.schema.default || [];
    this.field.additionalItems = this.additionalFields;
    this.field.additionalLabels = this.field.additionalItems.map(({ descriptor }, i) => descriptor.label || `Item ${i}`);
    this.field.uniqueItems = this.schema.uniqueItems === true;
    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    this.field.count = this.field.minItems || this.field.model.length;
    this.field.total = this.field.items.length + this.field.additionalItems.length;
    this.field.max = this.field.maxItems ? this.field.maxItems : this.field.total;

    if (this.field.max < this.field.minItems) {
      this.field.max = -1;
      this.field.total = -1;
    }
  }

  parseValue(data: any): string {
    return data !== void(0) ? data : '';
  }
}
