import { Parser } from '@/parsers/Parser';

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

export class EnumParser extends Parser<unknown, EnumField, ScalarDescriptor> {
  get kind(): FieldKind {
    return 'enum';
  }

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, this.kind).component;
  }

  get children(): RadioField[] {
    if (!Array.isArray(this.schema.enum)) {
      return [];
    }

    const radioName = this.options.name || UniqueId.get();
    const items = this.descriptor.items || {};
    const descriptorConstructor = this.options.descriptorConstructor;

    return this.schema.enum
      .map((item: any): JsonSchema => ({
        ...this.schema,
        default: item,
        enum: undefined,
        description: undefined,
        title: `${item}`
      }))
      .map((itemSchema) => {
        const item: any = itemSchema.default;
        const descriptor = items[item] || descriptorConstructor(itemSchema);

        if (!descriptor.kind) {
          descriptor.kind = 'radio';
        }

        const options: ParserOptions<unknown, AbstractUISchemaDescriptor, RadioField> = {
          schema: itemSchema,
          model: itemSchema.default,
          descriptor: items[item] || descriptorConstructor(itemSchema),
          descriptorConstructor: descriptorConstructor,
          bracketedObjectInputName: this.options.bracketedObjectInputName,
          id: `${radioName}-${UniqueId.parse(item)}`,
          name: radioName
        };

        const parser = Parser.get(options, this);

        // set the onChange option after the parser initialization
        // to prevent first field value emit
        options.onChange = () => {
          // In this step the input.checked property is already setted.
          // So no need to call updateInputsState().
          // So call the parent function super.setValue() instead of
          // the overrided one this.setValue()
          super.setValue(item);
          this.commit();
        };

        return parser;
      })
      .filter((parser) => parser instanceof Parser)
      .map((parser: any) => parser.field as RadioField);
  }

  setValue(value: unknown) {
    super.setValue(value);
    this.updateInputsState();
  }

  updateInputsState() {
    this.field.children.forEach(({ input }) => {
      input.attrs.checked = input.value === this.model;
    });
  }

  parse() {
    this.field.children = this.children;

    this.updateInputsState();
    this.commit();
  }
}

Parser.register('enum', EnumParser);
