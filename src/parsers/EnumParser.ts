import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';

import { Objects } from '@/lib/Objects';
import { JsonSchema } from '@/types/jsonschema';

import {
  EnumField,
  ScalarDescriptor,
  AbstractParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  RadioField
} from '@/types';
import { UniqueId } from '@/lib/UniqueId';

export class EnumParser extends AbstractParser<unknown, ScalarDescriptor, EnumField> {
  protected readonly enums: any[] = [];

  public get kind(): FieldKind {
    return 'enum';
  }

  protected get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, 'enum').component;
  }

  protected get children(): RadioField[] {
    const radioName = this.name || UniqueId.get();

    return this.enums
      .map((item): AbstractParserOptions<unknown, AbstractUISchemaDescriptor> => {
        const itemSchema: JsonSchema = {
          ...Objects.clone(this.schema) as JsonSchema,
          title: this.descriptor.labels
            ? this.descriptor.labels[item] || item
            : item,
          default: item
        };

        delete itemSchema.enum;

        return {
          schema: itemSchema,
          model: item,
          descriptor: this.options.descriptorConstructor(itemSchema),
          descriptorConstructor: this.options.descriptorConstructor,
          name: radioName,
          $forceUpdate: this.options.$forceUpdate
        };
      })
      .map((options) => Parser.get(options, this))
      .filter((parser) => parser instanceof AbstractParser)
      .map((parser: any) => {
        const field = parser.field as RadioField;

        field.attrs.input.checked = field.model === this.model;

        return field;
      });
  }

  public parse() {
    if (this.schema.enum instanceof Array) {
      this.enums.push(...this.schema.enum);
    }

    this.field.children = this.children;

    super.parse();
  }

  protected parseValue(data: unknown): unknown {
    return typeof data !== 'undefined' ? data : '';
  }
}
