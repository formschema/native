import { Parser } from '@/parsers/Parser';
import { UniqueId } from '@/lib/UniqueId';
import { JsonSchema } from '@/types/jsonschema';

import { EnumUIDescriptor } from '@/descriptors/EnumUIDescriptor';

import {
  EnumField,
  ParserOptions,
  RadioField,
  UnknowParser,
  EnumDescriptor
} from '@/types';

export class EnumParser extends Parser<unknown, EnumField, EnumUIDescriptor> {
  childrenParsers: UnknowParser[] = [];

  constructor(options: ParserOptions<unknown, EnumField, EnumDescriptor>, parent?: UnknowParser) {
    super('enum', options, parent);
  }

  get children(): RadioField[] {
    if (!Array.isArray(this.schema.enum)) {
      return [];
    }

    const radioId = this.options.id || UniqueId.get();
    const radioName = this.options.name || UniqueId.get();
    const descriptorItems = this.descriptor.items || {};

    this.childrenParsers.splice(0);

    return this.schema.enum
      .map((item: any): JsonSchema => ({
        ...this.schema,
        default: item,
        const: undefined,
        enum: undefined,
        description: undefined,
        title: `${item}`
      }))
      .reduce((fields, itemSchema) => {
        const item: any = itemSchema.default;

        const parser = Parser.get({
          id: `${radioId}-${UniqueId.parse(item)}`,
          name: radioName,
          schema: itemSchema,
          model: itemSchema.default,
          descriptor: descriptorItems[item],
          components: this.root.options.components
        }, this);

        if (parser) {
          // set the onChange option after the parser initialization
          // to prevent first field value emit
          parser.options.onChange = () => {
            // In this step the input.checked property is already setted.
            // So no need to call updateInputsState().
            // So call the parent function super.setValue() instead of
            // the overrided one this.setValue()
            super.setValue(item);
            this.commit();
          };

          fields.push(parser.field);
          this.childrenParsers.push(parser);
        }

        return fields;
      }, [] as RadioField[]);
  }

  setValue(value: unknown) {
    super.setValue(value);
    this.updateInputsState();
  }

  reset() {
    super.reset();
    this.childrenParsers.forEach((parser) => parser.reset());
  }

  clear() {
    super.clear();
    this.childrenParsers.forEach((parser) => parser.clear());
  }

  updateInputsState() {
    this.field.children.forEach(({ attrs, value }) => {
      attrs.checked = value === this.model;
    });
  }

  parse() {
    this.field.children = this.children;

    this.updateInputsState();
    this.commit();
  }
}

Parser.register('enum', EnumParser);
