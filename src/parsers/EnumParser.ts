import { Parser } from '@/parsers/Parser';

import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';
import { JsonSchema } from '@/types/jsonschema';

import {
  EnumField,
  ScalarDescriptor,
  ParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  RadioField
} from '@/types';

export class EnumParser extends Parser<unknown, ScalarDescriptor, EnumField> {
  public get kind(): FieldKind {
    return 'enum';
  }

  protected get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, 'enum').component;
  }

  protected get children(): RadioField[] {
    if (!Array.isArray(this.schema.enum)) {
      return [];
    }

    const radioName = this.name || UniqueId.get();

    return this.schema.enum
      .map((item: any): JsonSchema => ({
        ...Objects.clone<JsonSchema>(this.schema),
        const: item,
        enum: undefined,
        title: this.descriptor.labels && this.descriptor.labels.hasOwnProperty(item)
          ? this.descriptor.labels[item]
          : `${item}`
      }))
      .map((itemSchema): ParserOptions<unknown, AbstractUISchemaDescriptor, RadioField> => ({
        schema: itemSchema,
        model: itemSchema.const,
        descriptor: this.options.descriptorConstructor(itemSchema),
        descriptorConstructor: this.options.descriptorConstructor,
        name: radioName,
        onChange: (value, field) => {
          if (field.attrs.input.checked) {
            this.model = value;
          }

          this.emit();
        }
      }))
      .map((options) => Parser.get(options as any, this))
      .filter((parser) => parser instanceof Parser)
      .map((parser: any) => parser.field as RadioField);
  }

  public parse() {
    super.parse();

    this.field.children = this.children;

    this.field.children.forEach(({ attrs, value: model }) => {
      attrs.input.checked = model === this.model;
    });

    this.emit();
  }

  protected parseValue(data: unknown): unknown | undefined {
    return typeof data !== 'undefined' ? data : undefined;
  }
}

Parser.register('enum', EnumParser);
