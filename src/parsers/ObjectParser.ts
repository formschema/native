import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';
import { UniqueId } from '@/lib/UniqueId';
import { Objects } from '@/lib/Objects';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import {
  Dictionary,
  ObjectField,
  ObjectDescriptor,
  ParserOptions,
  AbstractUISchemaDescriptor,
  ObjectFieldChild,
  DescriptorConstructor,
  FieldKind,
  UnknowParser
} from '@/types';

export class ObjectParser extends Parser<Dictionary, ObjectField, ObjectDescriptor> {
  properties: Dictionary<JsonSchema> = {};
  dependencies: Dictionary<string[]> = {};
  childrenParsers: Dictionary<UnknowParser> = {};
  orders: string[] = [];

  get kind(): FieldKind {
    return 'object';
  }

  get initialValue(): Dictionary | unknown {
    const value = this.options.model || this.schema.default || {};

    return { ...value };
  }

  get propertiesList() {
    const keys = Object.keys(this.properties);
    const items = [ ...this.orders ];

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
      .map((key): { key: string; options: ParserOptions<unknown, AbstractUISchemaDescriptor> } => ({
        key,
        options: {
          schema: this.properties[key],
          model: this.model.hasOwnProperty(key) ? this.model[key] : this.properties[key].default,
          descriptor: this.getChildDescriptor(key),
          descriptorConstructor: this.getChildDescriptorConstructor(key),
          bracketedObjectInputName: this.options.bracketedObjectInputName,
          id: `${this.id}-${key}`,
          name: this.getChildName(key, name),
          required: requiredFields.includes(key),
          onChange: (value) => this.setKeyValue(key, value)
        }
      }))
      .map(({ options, ...args }) => ({
        ...args,
        parser: Parser.get(options, this)
      }))
      .filter(({ parser }) => parser instanceof Parser)
      .map(({ key, parser }: any) => {
        const field = parser.field as ObjectField;
        const update = parser.options.onChange;

        this.childrenParsers[key] = parser;

        /**
         * Update the parser.options.onChange reference to
         * enable dependencies update
         */
        parser.options.onChange = (value: unknown) => {
          update(value);
          this.commit();
          this.updateDependencies(key, parser);
        };

        return field;
      });
  }

  setKeyValue(key: string, value: unknown) {
    this.rawValue[key] = value;
    this.model[key] = value;
  }

  isEmpty(data: Dictionary = this.model) {
    return Objects.isEmpty(data);
  }

  clearModel() {
    Objects.clear(this.rawValue);
    Objects.clear(this.model);
  }

  reset() {
    this.clearModel();

    for (const key in this.childrenParsers) {
      this.childrenParsers[key].reset();
      this.setKeyValue(key, this.childrenParsers[key].model);
    }
  }

  clear() {
    this.clearModel();

    for (const key in this.childrenParsers) {
      this.childrenParsers[key].clear();
    }
  }

  updateDependencies(key: string, parser: UnknowParser) {
    if (this.dependencies[key]) {
      const needUpdate = [ parser.field ];
      const isRequired = !parser.isEmpty();
      const fieldRequired = isRequired || this.hasFilledDependency(key);

      this.setRequiredDependency(key, parser, fieldRequired);

      this.dependencies[key].forEach((prop) => {
        const dependencyParser = this.childrenParsers[prop];

        this.setRequiredDependency(prop, dependencyParser, isRequired);
        needUpdate.push(dependencyParser.field);
      });

      this.requestRender(needUpdate);
    }
  }

  hasFilledDependency(key: string) {
    return Object.keys(this.dependencies).some((prop) => {
      return this.dependencies[prop].includes(key) && !this.childrenParsers[prop].isEmpty();
    });
  }

  setRequiredDependency(key: string, parser: UnknowParser, required: boolean) {
    if (parser.isEmpty(this.model[key])) {
      parser.field.key = UniqueId.get(key);
    }

    parser.field.required = required;
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

    if (properties) {
      const descriptorKey = properties[key];

      if (descriptorKey instanceof NativeDescriptor) {
        return descriptorKey.get(this.properties[key]);
      }

      if (descriptorKey) {
        return descriptorKey;
      }
    }

    return this.options.descriptorConstructor.get(this.properties[key]);
  }

  getChildDescriptorConstructor(key: string): DescriptorConstructor {
    const properties = this.field.descriptor.properties;

    if (properties) {
      const propertiesKey = properties[key];

      if (propertiesKey instanceof NativeDescriptor) {
        return propertiesKey;
      }
    }

    return this.options.descriptorConstructor;
  }

  parse() {
    if (this.schema.properties) {
      this.properties = { ...this.schema.properties };
    }

    this.orders = this.field.descriptor.order instanceof Array
      ? this.field.descriptor.order
      : [];

    if (this.orders.length === 0) {
      this.orders = Object.keys(this.properties);
    }

    this.parseDependencies();

    this.field.children = this.children;

    /**
     * attributes `required` and `aria-required` are not applicable here
     */
    delete this.attrs.required;
    delete this.attrs['aria-required'];

    if (this.isRoot) {
      /**
       * attribute `name` is not applicable here
       */
      delete this.attrs.name;
    }

    this.commit();
  }

  parseDependencies() {
    const dependencies = this.schema.dependencies;

    if (dependencies) {
      Object.keys(dependencies).forEach((key) => {
        const dependency = dependencies[key];

        if (dependency instanceof Array) {
          this.dependencies[key] = dependency;
        } else {
          const indexKey = (this.orders.indexOf(key) + 1) || this.orders.length;
          const properties = dependency.properties || {};

          this.dependencies[key] = Object.keys(properties);

          Object.keys(properties).forEach((prop, indexProp) => {
            this.properties[prop] = properties[prop];

            if (!this.orders.includes(prop)) {
              // insert dependency after its sibling property
              // if's there is no custum order defined
              this.orders.splice(indexKey + indexProp, 0, prop);
            }
          });
        }
      });
    }
  }

  parseValue(data: Dictionary): Dictionary {
    return data || {};
  }
}

Parser.register('object', ObjectParser);
