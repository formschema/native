import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';

import { Objects } from '@/lib/Objects';
import { JsonSchema } from '@/types/jsonschema';

import {
  EnumField,
  ScalarDescriptor,
  AbstractParserOptions,
  AbstractUISchemaDescriptor,
  EnumFieldChild
} from '@/types';

export class EnumParser extends AbstractParser<any, ScalarDescriptor, EnumField> {
  readonly enums: any[] = [];

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, 'enum').component;
  }

  get children(): EnumFieldChild[] {
    return this.enums.map((item) => {
      const itemSchema: JsonSchema = {
        ...Objects.assign({}, this.schema) as JsonSchema,
        title: this.descriptor.labels
          ? this.descriptor.labels[item] || item
          : item,
        default: item
      };

      delete itemSchema.enum;

      const options: AbstractParserOptions<any, AbstractUISchemaDescriptor> = {
        schema: itemSchema,
        model: item,
        descriptor: this.options.descriptorConstructor(itemSchema),
        descriptorConstructor: this.options.descriptorConstructor,
        name: this.options.name
      };

      const { field } = Parser.get(options, this);

      return field;
    });
  }

  parse() {
    if (this.schema.enum instanceof Array) {
      this.enums.push(...this.schema.enum);
    }

    this.field.kind = 'enum';
    this.field.children = this.children;

    this.parseField();
  }

  parseValue(data: any): string {
    return typeof data !== 'undefined' ? data : '';
  }
}
