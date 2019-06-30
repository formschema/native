import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';

import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';
import { JsonSchema } from '@/types/jsonschema';

import {
  EnumField,
  ScalarDescriptor,
  AbstractParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  RadioField
} from '@/types';

export class EnumParser extends AbstractParser<unknown, ScalarDescriptor, EnumField> {
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
      .map((itemSchema): AbstractParserOptions<unknown, AbstractUISchemaDescriptor> => ({
        schema: itemSchema,
        model: itemSchema.const,
        descriptor: this.options.descriptorConstructor(itemSchema),
        descriptorConstructor: this.options.descriptorConstructor,
        name: radioName,
        $forceUpdate: this.options.$forceUpdate
      }))
      .map((options) => Parser.get(options, this))
      .filter((parser) => parser instanceof AbstractParser)
      .map((parser: any) => parser.field as RadioField);
  }

  public parse() {
    super.parse();

    this.field.children = this.children;

    this.field.children.forEach(({ attrs, model }) => {
      attrs.input.checked = model === this.model;
    });
  }

  protected parseValue(data: unknown): unknown {
    return typeof data !== 'undefined' ? data : undefined;
  }
}
