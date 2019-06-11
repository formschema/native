import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';
import { JsonSchema } from '@/types/jsonschema';

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

export class ObjectParser<
  TModel extends Dictionary = Dictionary
> extends AbstractParser<TModel, ObjectDescriptor, ObjectField> {
  protected properties: Dictionary<JsonSchema> = {};

  public get kind(): FieldKind {
    return 'object';
  }

  public get required() {
    return this.schema.required instanceof Array ? this.schema.required : [];
  }

  public get propertiesList() {
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

  public get children(): ObjectFieldChild[] {
    return this.propertiesList
      .map((key): AbstractParserOptions<unknown, AbstractUISchemaDescriptor> => ({
        schema: this.properties[key],
        model: this.model.hasOwnProperty(key) ? this.model[key] : this.properties[key].default,
        descriptor: this.getChildDescriptor(key),
        descriptorConstructor: this.getChildDescriptorConstructor(key),
        name: key,
        $vue: this.options.$vue
      }))
      .map((options) => Parser.get(options, this))
      .map((parser) => parser.field);
  }

  protected getChildDescriptor(key: string) {
    const properties = this.field.descriptor.properties;

    return properties
      ? properties[key] instanceof Function
        ? (properties[key] as Function)(properties[key])
        : properties[key]
      : this.options.descriptorConstructor(this.properties[key]);
  }

  protected getChildDescriptorConstructor(key: string): DescriptorConstructor {
    const properties = this.field.descriptor.properties;

    return properties && properties[key] instanceof Function
      ? properties[key] as DescriptorConstructor
      : this.options.descriptorConstructor;
  }

  public parse() {
    if (this.schema.properties) {
      this.properties = this.schema.properties;
    }

    this.field.children = this.children;

    this.parseField();

    if (this.isRoot) {
      delete this.field.attrs.input.name;
    }
  }

  protected parseField() {
    super.parseField();

    delete this.field.attrs.input.required;
    delete this.field.attrs.input['aria-required'];
  }

  protected parseValue(data: TModel): TModel {
    return data || {};
  }
}
