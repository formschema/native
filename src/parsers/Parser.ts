import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { JsonSchema } from '@/types/jsonschema';

import {
  AbstractUISchemaDescriptor,
  ParserOptions,
  Attributes,
  Dictionary,
  ParserKind,
  FieldKind,
  IParser,
  UnknowParser,
  Field,
  UnknowField
} from '@/types';

const PARSERS: Dictionary<any> = {};

export abstract class Parser<
  TModel,
  TField extends Field<any, TAttributes, TDescriptor, TModel>,
  TDescriptor extends AbstractUISchemaDescriptor,
  TAttributes extends Attributes = Attributes
> implements IParser<TModel, TField, TDescriptor> {
  readonly id: string;
  readonly isRoot: boolean;
  readonly isEnumItem: boolean;
  readonly parent?: UnknowParser;
  readonly root: UnknowParser;
  model: TModel;
  rawValue: TModel;
  readonly field: TField;
  readonly options: ParserOptions<TModel, TDescriptor>;
  readonly descriptor: TDescriptor;
  readonly schema: JsonSchema;
  readonly attrs: TAttributes;

  static register(type: ParserKind, parserClass: any) {
    PARSERS[type] = parserClass;
  }

  static get(options: ParserOptions<any, any, any>, parent?: UnknowParser): UnknowParser | null {
    if (typeof options.schema.type === 'undefined') {
      return null;
    }

    if (!PARSERS[options.schema.type]) {
      throw TypeError(`Unsupported schema type: ${JSON.stringify(options.schema.type)}`);
    }

    const descriptor = options.descriptor
      || options.descriptorConstructor<AbstractUISchemaDescriptor>(options.schema);

    const schemaKind = descriptor.kind && PARSERS.hasOwnProperty(descriptor.kind)
      ? descriptor.kind
      : NativeDescriptor.kind(options.schema);

    const parser = new PARSERS[schemaKind](options, parent);

    parser.parse();

    return parser;
  }

  constructor(options: ParserOptions<TModel, TDescriptor>, parent?: UnknowParser) {
    this.id = options.id || UniqueId.get(options.name);
    this.parent = parent;
    this.options = options;
    this.root = parent ? parent.root : this;
    this.isRoot = !parent;
    this.isEnumItem = !!parent && parent.schema.enum instanceof Array;
    this.schema = options.schema;

    const defaultDescriptor = options.descriptorConstructor<TDescriptor>(this.schema);

    this.descriptor = options.descriptor || defaultDescriptor;
    this.rawValue = this.parseValue(this.initialValue) as TModel;
    this.model = this.parseValue(this.initialValue) as TModel;

    this.parseDescriptor();

    const self = this;

    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    this.attrs = {
      id: this.id,
      type: this.type,
      name: options.name,
      readonly: this.schema.readOnly,
      get required() {
        return self.field.required;
      },

      /**
       * Add support with web browsers that don’t communicate the required
       * attribute to assistive technology
       * @see https://www.w3.org/WAI/tutorials/forms/validation/#validating-required-input
       */
      get 'aria-required'() {
        return this.required ? 'true' : undefined;
      },

      /**
       * Use the WAI-ARIA aria-labelledby and aria-describedby attributes to
       * associate instructions with form controls
       * @see https://www.w3.org/WAI/tutorials/forms/instructions/#providing-instructions-outside-labels
       */
      get 'aria-labelledby'() {
        return self.field.label.attrs.id;
      },
      get 'aria-describedby'() {
        return self.field.helper.attrs.id;
      },

      /**
       * Add descriptor attributes
       */
      ...this.descriptor.attrs
    } as TAttributes;

    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    this.field = {
      key: options.key || UniqueId.get(options.name),
      kind: this.kind,
      name: options.name,
      isRoot: this.isRoot,
      schema: options.schema,
      required: options.required || false,
      deep: this.isRoot ? 0 : this.root.field.deep + 1,
      input: {
        attrs: this.attrs,
        get value() {
          return self.model;
        },
        setValue: (value: TModel) => {
          this.setValue(value);
          this.commit();
        },
        props: Objects.clone(this.descriptor.props as Dictionary),
        component: this.descriptor.component || this.defaultComponent || defaultDescriptor.component
      },
      label: {
        attrs: {
          get id() {
            return self.field.label.value ? `${self.attrs.id}-label` : undefined;
          },
          get for() {
            return self.attrs.id;
          }
        },
        value: this.descriptor.label
      },
      helper: {
        attrs: {
          get id() {
            return self.field.helper.value ? `${self.attrs.id}-helper` : undefined;
          }
        },
        value: this.descriptor.helper
      },
      descriptor: this.descriptor,
      parent: parent ? parent.field : undefined
    } as TField;
  }

  get kind(): FieldKind {
    return this.schema.type;
  }

  get type(): string | undefined {
    return undefined;
  }

  get initialValue(): TModel | unknown {
    return typeof this.options.model === 'undefined'
      ? this.schema.default
      : this.options.model;
  }

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<TDescriptor>(this.schema, this.descriptor.kind).component
      : undefined;
  }

  isEmpty(data: unknown = this.model) {
    return typeof data === 'undefined';
  }

  parseValue(data: unknown): TModel | undefined {
    return data as any;
  }

  setValue(value: unknown) {
    this.rawValue = value as any;
    this.model = this.parseValue(value) as TModel;
  }

  commit() {
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(this.model, this.field);
    }
  }

  requestRender(fields: UnknowField[]) {
    if (typeof this.root.options.requestRender === 'function') {
      this.root.options.requestRender(fields);
    }
  }

  parseDescriptor() {
    if (!this.descriptor.kind) {
      this.descriptor.kind = this.kind;
    }

    if (!this.descriptor.hasOwnProperty('label')) {
      this.descriptor.label = this.schema.title;
    }

    if (!this.descriptor.hasOwnProperty('helper')) {
      this.descriptor.helper = this.schema.description;
    }

    if (!this.descriptor.attrs) {
      this.descriptor.attrs = {};
    }

    if (!this.descriptor.props) {
      this.descriptor.props = {};
    }
  }

  abstract parse(): void;
}
