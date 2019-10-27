import { Parser } from '@/parsers/Parser';
import { SetParser } from '@/parsers/SetParser';
import { JsonSchema } from '@/types/jsonschema';
import { UniqueId } from '@/lib/UniqueId';
import { Objects } from '@/lib/Objects';
import { Value } from '@/lib/Value';

import { Dict, ObjectField, ParserOptions, ObjectFieldChild, UnknowParser, ObjectDescriptor, UnknowField } from '@/types';
import { ObjectUIDescriptor } from '@/descriptors/ObjectUIDescriptor';

export class ObjectParser extends SetParser<Dict, ObjectField, ObjectUIDescriptor> {
  properties: Dict<JsonSchema> = {};
  dependencies: Dict<string[]> = {};
  childrenParsers: Dict<UnknowParser> = {};

  constructor(options: ParserOptions<Dict, ObjectField, ObjectDescriptor>, parent?: UnknowParser) {
    super('object', options, parent);
  }

  get initialValue(): Dict {
    const value = this.options.model || this.schema.default;

    return Objects.isObject(value) ? { ...value } as any : {};
  }

  get children(): Dict<ObjectFieldChild> {
    const name = this.options.name;
    const fields: Dict<ObjectFieldChild> = {};
    const descriptorProperties = this.descriptor.properties || {};
    const requiredFields = this.schema.required instanceof Array
      ? this.schema.required
      : [];

    Object.keys(this.properties)
      .map((key): { key: string; options: ParserOptions<unknown, UnknowField> } => ({
        key,
        options: {
          schema: this.properties[key],
          model: this.model.hasOwnProperty(key) ? this.model[key] : this.properties[key].default,
          id: `${this.id}-${key}`,
          name: this.getChildName(key, name),
          required: requiredFields.includes(key),
          descriptor: descriptorProperties[key],
          components: this.root.options.components,
          onChange: (value) => this.setKeyValue(key, value)
        }
      }))
      .map(({ options, ...args }) => ({
        ...args,
        parser: Parser.get(options, this)
      }))
      .filter(({ parser }) => parser instanceof Parser)
      .forEach(({ key, parser }: any) => {
        const field = parser.field as ObjectFieldChild;
        const update = parser.options.onChange;

        field.property = key;
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

        fields[key] = field;
      });

    return fields;
  }

  setKeyValue(key: string, value: unknown) {
    this.rawValue[key] = value;
    this.model[key] = value;
  }

  isEmpty(data: Dict = this.model) {
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
      return this.root.options.bracketedObjectInputName
        ? `${name}[${key}]`
        : `${name}.${key}`;
    }

    return key;
  }

  parse() {
    if (this.schema.properties) {
      this.properties = { ...this.schema.properties };
    }

    this.parseDependencies();

    this.field.children = this.children;
    this.field.childrenList = Object.values(this.field.children);

    /**
     * attributes `required` and `aria-required` are not applicable here
     */
    delete this.field.attrs.required;
    delete this.field.attrs['aria-required'];

    if (this.isRoot) {
      /**
       * attribute `name` is not applicable here
       */
      delete this.field.attrs.name;
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
          const properties = dependency.properties || {};

          this.dependencies[key] = Object.keys(properties);

          Object.keys(properties).forEach((prop) => {
            this.properties[prop] = properties[prop];
          });
        }
      });
    }
  }

  parseValue(data: unknown) {
    return Value.object(data);
  }
}

Parser.register('object', ObjectParser);
