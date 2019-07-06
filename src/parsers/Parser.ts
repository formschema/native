import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { JsonSchema } from '@/types/jsonschema';

import {
  Field,
  AbstractUISchemaDescriptor,
  ParserOptions,
  DescriptorInstance,
  Attributes,
  Dictionary,
  ParserKind,
  FieldKind,
  IParser,
  UnknowParser
} from '@/types';

const PARSERS: Dictionary<any> = {};

export abstract class Parser<
  TModel,
  TDescriptor extends AbstractUISchemaDescriptor,
  TField extends Field<any, Attributes, DescriptorInstance, any>
> implements IParser<TModel, TDescriptor, TField> {
  readonly isRoot: boolean;
  readonly isEnumItem: boolean;
  readonly parent?: UnknowParser;
  readonly root: UnknowParser;
  model: TModel;
  rawValue: TModel;
  readonly options: ParserOptions<TModel, TDescriptor>;
  readonly field: TField;
  readonly descriptor: TDescriptor;
  readonly schema: JsonSchema;

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
    const attrs = this.descriptor.attrs || {};
    const props = this.descriptor.props || {};

    delete attrs.name;

    this.field = {
      kind: this.kind,
      name: options.name,
      isRoot: this.isRoot,
      required: this.isRoot || options.required || false,
      defaultValue: this.parseValue(options.schema.default),
      get value() {
        return self.model;
      },
      get rawValue() {
        return self.rawValue;
      },
      setValue: (value: TModel) => {
        this.setValue(value);
        this.commit();
      },
      attrs: {
        input: {
          type: undefined,
          name: options.name,
          ...attrs
        },
        label: {},
        description: {}
      },
      props: Objects.clone(props),
      descriptor: this.descriptor,
      component: this.descriptor.component || this.defaultComponent || defaultDescriptor.component,
      parent: parent ? parent.field : undefined
    } as unknown as TField;
  }

  get kind(): FieldKind {
    return this.schema.type;
  }

  get type(): string | undefined {
    return undefined;
  }

  get initialValue(): TModel | unknown {
    if (typeof this.options.model !== 'undefined') {
      return this.options.model;
    }

    return this.schema.default;
  }

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<TDescriptor>(this.schema, this.descriptor.kind).component
      : undefined;
  }

  parseValue(data: unknown): TModel | undefined {
    return data as any;
  }

  setValue(value: unknown) {
    this.rawValue = value as any;
    this.model = this.parseValue(value) as TModel;
  }

  commit() {
    if (this.options.onChange instanceof Function) {
      this.options.onChange(this.model, this.field);
    }
  }

  parseDescriptor() {
    if (!this.descriptor.kind) {
      this.descriptor.kind = this.kind;
    }

    if (!this.descriptor.hasOwnProperty('label')) {
      this.descriptor.label = this.schema.title;
    }

    if (!this.descriptor.hasOwnProperty('description')) {
      this.descriptor.description = this.schema.description;
    }
  }

  parse() {
    const id = this.field.attrs.input.id || UniqueId.get(this.options.name);
    const labelId = this.field.descriptor.label ? `${id}-label` : undefined;
    const descId = this.field.descriptor.description ? `${id}-desc` : undefined;
    const ariaLabels = [ labelId, descId ].filter((item) => item);

    if (!this.field.attrs.input.id) {
      this.field.attrs.input.id = id;
    }

    this.field.attrs.input.type = this.type;
    this.field.attrs.input.readonly = this.schema.readOnly || false;
    this.field.attrs.input.required = this.field.required;

    this.field.attrs.label.id = labelId;
    this.field.attrs.label.for = id;

    this.field.attrs.description.id = descId;

    if (this.field.required) {
      /**
       * Add support with web browsers that don’t communicate the required
       * attribute to assistive technology
       * @see https://www.w3.org/WAI/tutorials/forms/validation/#validating-required-input
       */
      this.field.attrs.input['aria-required'] = 'true';
    }

    if (ariaLabels.length && !this.field.attrs.hasOwnProperty('aria-labelledby')) {
      /**
       * Use the WAI-ARIA aria-labelledby attribute to associate instructions
       * with form controls
       * @see https://www.w3.org/WAI/tutorials/forms/instructions/#using-aria-labelledby
       */
      this.field.attrs.input['aria-labelledby'] = ariaLabels.join(' ');

      if (ariaLabels.length >= 2) {
        /**
         * Add `tabindex="-1"` to elements that are referenced by aria-labelledby
         * if it point to two or more elements for Internet Explorer
         * compatibility
         */
        this.field.attrs.label.tabindex = '-1';
        this.field.attrs.description.tabindex = '-1';
      }
    }
  }
}
