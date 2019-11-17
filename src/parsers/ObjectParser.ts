import { Parser } from '@/parsers/Parser';
import { SetParser } from '@/parsers/SetParser';
import { JsonSchema } from '@/types/jsonschema';
import { UniqueId } from '@/lib/UniqueId';
import { Objects } from '@/lib/Objects';
import { Value } from '@/lib/Value';

import { Dict, ObjectField, ParserOptions, ObjectFieldChild, UnknowParser, ObjectDescriptor, UnknowField } from '@/types';
import { ObjectUIDescriptor } from '@/descriptors/ObjectUIDescriptor';

export class ObjectParser extends SetParser<Dict, ObjectField, ObjectDescriptor, ObjectUIDescriptor> {
  properties: Dict<JsonSchema> = {};
  readonly dependencies: Dict<string[]> = {};
  readonly childrenParsers: Dict<UnknowParser> = {};
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

          if (this.schema.if) {
            this.parseConditional();
            this.parseField();
            this.parseDescriptor();
          } else {
            this.commit();
            this.updateDependencies(key, parser);
          }
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

  parseField() {
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

  parseConditional() {
    /* istanbul ignore else */
    if (this.initialSchema.if && this.initialSchema.then) {
      this.schema = Objects.clone(this.initialSchema);

      this.parseConditionalSchema(this.initialSchema);
    }
  }

  validateConditionalSchemaValue(conditionalSchema: JsonSchema) {
    /* istanbul ignore else */
    if (conditionalSchema.properties) {
      const properties = conditionalSchema.properties;

      for (const prop in properties) {
        if (!properties[prop] || this.model[prop] !== properties[prop].const) {
          return false;
        }
      }
    }

    return true;
  }

  mergeConditionalSchema(conditionalSchema: JsonSchema) {
    /* istanbul ignore else */
    if (conditionalSchema.properties) {
      const properties = conditionalSchema.properties;

      /* istanbul ignore if */
      if (!this.schema.properties) {
        this.schema.properties = {};
      }

      for (const prop in properties) {
        const property = properties[prop];

        Object.assign(this.schema.properties[prop], property);

        /* istanbul ignore else */
        if (property.hasOwnProperty('default')) {
          const childField = this.field.getField(`.${prop}`);

          /* istanbul ignore else */
          if (childField) {
            childField.setValue(property.default, false);
            this.setKeyValue(prop, property.default);
          }
        }
      }
    }
  }

  parseConditionalSchema(inputSchema: JsonSchema) {
    /* istanbul ignore else */
    if (inputSchema.if && inputSchema.then) {
      if (this.validateConditionalSchemaValue(inputSchema.if)) {
        this.mergeConditionalSchema(inputSchema.then);
      } else {
        /* istanbul ignore else */
        if (inputSchema.else) {
          if (inputSchema.else.if) {
            this.parseConditionalSchema(inputSchema.else);
          } else {
            this.mergeConditionalSchema(inputSchema.else);
          }
        }
      }
    }
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
