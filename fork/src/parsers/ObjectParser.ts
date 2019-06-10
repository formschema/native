import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';
import { JsonSchema } from "@/types/jsonschema";

import {
  Dictionary,
  ObjectField,
  ObjectDescriptor,
  AbstractParserOptions,
  AbstractUISchemaDescriptor,
  ObjectFieldChild,
  DescriptorConstructor,
  FieldKind
} from '@/types';

export class ObjectParser<T extends Dictionary = object> extends AbstractParser<T, ObjectDescriptor, ObjectField> {
  readonly properties: Dictionary<JsonSchema> = {};

  get kind(): FieldKind {
    return 'object';
  }

  get required() {
    return this.schema.required instanceof Array ? this.schema.required : [];
  }

  get propertiesList() {
    const keys = Object.keys(this.properties);
    const items = this.field.descriptor.order instanceof Array
      ? this.field.descriptor.order
      : keys;

    if (items.length < keys.length) {
      keys.forEach((prop) => {
        if (!items.includes(prop)) {
          items.push(prop);
        }
      });
    }

    return items;
  }

  get children(): ObjectFieldChild[] {
    return this.propertiesList
      .map((key) => ({
        schema: this.properties[key],
        model: this.model[key] || this.properties[key].default,
        descriptor: this.getChildDescriptor(key),
        descriptorConstructor: this.getChildDescriptorConstructor(key),
        name: key
      } as AbstractParserOptions<any, AbstractUISchemaDescriptor>))
      .map((options) => Parser.get(options, this))
      .map((parser) => parser.field);
  }

  getChildDescriptor(key: string) {
    const properties = this.field.descriptor.properties;

    return properties
      ? properties[key] instanceof Function
        ? (properties[key] as Function)(properties[key])
        : properties[key]
      : this.options.descriptorConstructor(this.properties[key]);
  }

  getChildDescriptorConstructor(key: string): DescriptorConstructor {
    const properties = this.field.descriptor.properties;

    return properties && properties[key] instanceof Function
      ? properties[key] as DescriptorConstructor
      : this.options.descriptorConstructor;
  }

  parse() {
    if (this.schema.properties) {
      Object.assign(this.properties, this.schema.properties);
    }

    this.field.children = this.children;

    this.parseField();

    if (!this.parent) {
      delete this.field.attrs.input.name;
    }
  }

  parseField() {
    super.parseField();

    delete this.field.attrs.input.required;
    delete this.field.attrs.input['aria-required'];
  }

  parseValue(data: any): T {
    return data || {};
  }
}
