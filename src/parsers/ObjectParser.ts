import { Parser } from '@/parsers/Parser';
import { SetParser } from '@/parsers/SetParser';
import { UniqueId } from '@/lib/UniqueId';
import { Objects } from '@/lib/Objects';
import { Value } from '@/lib/Value';

import { ObjectUIDescriptor } from '@/descriptors/ObjectUIDescriptor';
import { JsonSchema } from '../../types/jsonschema';

import {
  Dict,
  ObjectField,
  ParserOptions,
  ObjectFieldChild,
  UnknowParser,
  ObjectDescriptor,
  UnknowField
} from '../../types';

export class ObjectParser extends SetParser<Dict, ObjectField, ObjectDescriptor, ObjectUIDescriptor> {
  properties: Dict<JsonSchema> = {};
  readonly dependencies: Dict<string[]> = {};
  readonly childrenParsers: Dict<Parser<any, any, any, any>> = {};
  readonly initialSchema: JsonSchema;

  constructor(options: ParserOptions<Dict, ObjectField, ObjectDescriptor>, parent?: UnknowParser) {
    super('object', options, parent);

    this.initialSchema = Objects.clone(this.schema);
  }

  get initialValue(): Dict {
    const value = this.options.model || this.schema.default as object;

    return Objects.isObject(value) ? { ...value } as any : {};
  }

  get fields(): Dict<ObjectFieldChild> {
    const name = this.options.name;
    const fields: Dict<ObjectFieldChild> = {};

    const descriptorProperties = this.options.descriptor
      ? this.options.descriptor.properties || {}
      : {};

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

          if (!this.parseConditional()) {
            this.updateDependencies(key, parser);
          }
        };

        fields[key] = field;
      });

    return fields;
  }

  setKeyValue(key: string, value: unknown): void {
    this.rawValue[key] = value;
    this.model[key] = value;
  }

  isEmpty(data: Dict = this.model): boolean {
    return Objects.isEmpty(data);
  }

  clearModel(): void {
    Objects.clear(this.rawValue);
    Objects.clear(this.model);
  }

  reset(): void {
    this.clearModel();

    for (const key in this.childrenParsers) {
      this.childrenParsers[key].reset();
      this.setKeyValue(key, this.childrenParsers[key].model);
    }
  }

  clear(): void {
    this.clearModel();

    for (const key in this.childrenParsers) {
      this.childrenParsers[key].clear();
    }
  }

  updateDependencies(key: string, parser: UnknowParser): void {
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

  hasFilledDependency(key: string): boolean {
    return Object.keys(this.dependencies).some((prop) => {
      return this.dependencies[prop].includes(key) && !this.childrenParsers[prop].isEmpty();
    });
  }

  setRequiredDependency(key: string, parser: UnknowParser, required: boolean): void {
    if (parser.isEmpty(this.model[key])) {
      parser.field.key = UniqueId.get(key);
    }

    parser.field.required = required;
  }

  getChildName(key: string, name?: string): string {
    if (name) {
      return this.root.options.bracketedObjectInputName
        ? `${name}[${key}]`
        : `${name}.${key}`;
    }

    return key;
  }

  parse(): void {
    super.parse();
    this.parseConditional();
  }

  parseField(): void {
    if (this.schema.properties) {
      this.properties = { ...this.schema.properties };
    }

    this.parseDependencies();

    this.field.fields = this.fields;
    this.field.children = Object.values(this.field.fields);

    /**
     * attributes `required` and `aria-required` are not applicable here
     */
    delete this.field.attrs.required;
    delete this.field.attrs['aria-required'];

    if (this.isRoot) {
      /**
       * attribute `name` is not applicable here since the
       * parent form element already use it
       */
      delete this.field.attrs.name;
    }
  }

  parseConditional(): boolean {
    /* istanbul ignore else */
    if (this.initialSchema.if) {
      const cachedSchema = Objects.clone(this.schema);

      this.parseConditionalSchema(this.initialSchema);

      if (Objects.equal(cachedSchema, this.schema)) {
        return false;
      }

      this.resetConditionalSchemaProperties(this.schema);
      this.parseField();

      return true;
    }

    return false;
  }

  validateConditionalSchemaValue(conditionalSchema: JsonSchema): boolean {
    const properties = conditionalSchema.properties || {};

    for (const prop in properties) {
      if (!properties[prop] || this.model[prop] !== properties[prop].const) {
        return false;
      }
    }

    return true;
  }

  mergeConditionalSchema(conditionalSchema: JsonSchema): void {
    /* istanbul ignore else */
    if (conditionalSchema.properties) {
      const conditionalProperties = conditionalSchema.properties || {};
      const schemaProperties = this.schema.properties || {};
      const schemaRequired = this.schema.required || [];

      Object.assign(this.schema, conditionalSchema);

      this.schema.properties = schemaProperties;
      this.schema.required = schemaRequired;

      for (const prop in conditionalProperties) {
        const property = conditionalProperties[prop];

        /* istanbul ignore else */
        if (this.schema.properties[prop]) {
          Object.assign(this.schema.properties[prop], property);
        } else {
          this.schema.properties[prop] = property;
        }
      }

      if (conditionalSchema.required) {
        this.schema.required.push(...conditionalSchema.required);
      }
    }
  }

  resetConditionalSchemaProperties(conditionalSchema: JsonSchema): void {
    /* istanbul ignore else */
    if (conditionalSchema.properties) {
      const initialSchemaProperties = this.initialSchema.properties || {};

      for (const prop in conditionalSchema.properties) {
        if (initialSchemaProperties[prop]) {
          continue;
        }

        /* istanbul ignore else */
        if (this.field.fields.hasOwnProperty(prop)) {
          const property = conditionalSchema.properties[prop];
          const defaultSchemaValue = property.default;

          this.field.fields[prop].setValue(defaultSchemaValue, false);
          this.setKeyValue(prop, defaultSchemaValue);
        }
      }
    }
  }

  parseConditionalSchema(conditionalSchema: JsonSchema): void {
    /* istanbul ignore else */
    if (conditionalSchema.if) {
      if (this.validateConditionalSchemaValue(conditionalSchema.if)) {
        /* istanbul ignore else */
        if (conditionalSchema.then) {
          this.mergeConditionalSchema(conditionalSchema.then);
        }
      } else if (conditionalSchema.else) {
        if (conditionalSchema.else.if) {
          this.parseConditionalSchema(conditionalSchema.else);
        } else {
          this.mergeConditionalSchema(conditionalSchema.else);
        }
      }
    }
  }

  parseDependencies(): void {
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

  parseValue(data: unknown): Dict<unknown> {
    return Value.object(data);
  }
}

Parser.register('object', ObjectParser);
