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
      : this.options.descriptorConstructor(this.schema, this.kind).component;
  }

  protected setValue(value: unknown) {
    super.setValue(value);
    this.updateInputsState();
  }

  protected updateInputsState() {
    this.field.children.forEach(({ attrs, value: model }) => {
      attrs.input.checked = model === this.model;
    });
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
      .map((itemSchema) => {
        const options: ParserOptions<unknown, AbstractUISchemaDescriptor, RadioField> = {
          schema: itemSchema,
          model: itemSchema.const,
          descriptor: this.options.descriptorConstructor(itemSchema),
          descriptorConstructor: this.options.descriptorConstructor,
          name: radioName
        };

        const parser = Parser.get(options, this);

        // set the onChange option after the parser initialization
        // to prevent first field value emit
        options.onChange = (value: unknown) => {
          // In this step the input.checked property is already setted.
          // So no need to call updateInputsState().
          // So call the parent function super.setValue() instead of
          // the overrided one this.setValue()
          super.setValue(value);
          this.commit();
        };

        return parser;
      })
      .filter((parser) => parser instanceof Parser)
      .map((parser: any) => parser.field as RadioField);
  }

  public parse() {
    super.parse();

    this.field.children = this.children;

    this.updateInputsState();
    this.commit();
  }

  protected parseValue(data: unknown): unknown {
    return data;
  }
}

Parser.register('enum', EnumParser);
