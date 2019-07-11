import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';

import {
  Dictionary,
  ObjectField,
  ObjectDescriptor,
  ParserOptions,
  AbstractUISchemaDescriptor,
  ObjectFieldChild,
  DescriptorConstructor,
  FieldKind,
  IObjectParser
} from '@/types';

export class ObjectParser extends Parser<Dictionary, ObjectDescriptor, ObjectField> implements IObjectParser {
  properties: Dictionary<JsonSchema> = {};

  get kind(): FieldKind {
    return 'object';
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
    const name = this.options.name;
    const requiredFields = this.schema.required instanceof Array
      ? this.schema.required
      : [];

    return this.propertiesList
      .map((key): ParserOptions<unknown, AbstractUISchemaDescriptor> => ({
        schema: this.properties[key],
        model: this.model.hasOwnProperty(key) ? this.model[key] : this.properties[key].default,
        descriptor: this.getChildDescriptor(key),
        descriptorConstructor: this.getChildDescriptorConstructor(key),
        bracketedObjectInputName: this.options.bracketedObjectInputName,
        id: name ? `${name}-${key}` : undefined,
        name: this.getChildName(key, name),
        required: requiredFields.includes(key),
        onChange: (value) => {
          this.model[key] = value;

          this.commit();
        }
      }))
      .map((options) => Parser.get(options, this))
      .filter((parser) => parser instanceof Parser)
      .map((parser: any) => parser.field as ObjectFieldChild);
  }

  getChildName(key: string, name?: string) {
    if (name) {
      return this.options.bracketedObjectInputName
        ? `${name}[${key}]`
        : `${name}.${key}`;
    }

    return key;
  }

  getChildDescriptor(key: string) {
    const properties = this.field.descriptor.properties;

    return properties
      ? typeof properties[key] === 'function'
        ? (properties[key] as Function)(properties[key])
        : properties[key]
      : this.options.descriptorConstructor(this.properties[key]);
  }

  getChildDescriptorConstructor(key: string): DescriptorConstructor {
    const properties = this.field.descriptor.properties;

    return properties && typeof properties[key] === 'function'
      ? properties[key] as DescriptorConstructor
      : this.options.descriptorConstructor;
  }

  parse() {
    if (this.schema.properties) {
      this.properties = this.schema.properties;
    }

    this.field.children = this.children;

    super.parse();

    delete this.field.attrs.input.required;
    delete this.field.attrs.input['aria-required'];

    if (this.isRoot) {
      delete this.field.attrs.input.name;
    }

    this.commit();
  }

  parseValue(data: Dictionary): Dictionary {
    return data || {};
  }
}

Parser.register('object', ObjectParser);
