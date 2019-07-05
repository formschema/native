import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import {
  Field,
  AbstractUISchemaDescriptor,
  ParserOptions,
  UnknowField,
  DescriptorInstance,
  Attributes,
  Dictionary,
  ParserKind,
  FieldKind
} from '@/types';

export type Parent = Parser<any, AbstractUISchemaDescriptor, UnknowField>;

const PARSERS: Dictionary<any> = {};

export abstract class Parser<
  TModel,
  TDescriptor extends AbstractUISchemaDescriptor,
  TField extends Field<any, Attributes, DescriptorInstance, any>
> {
  protected readonly isRoot: boolean;
  protected readonly isEnumItem: boolean;
  protected readonly isArrayItem: boolean;
  protected readonly name?: string;
  protected readonly parent?: Parent;
  protected readonly root: Parent;
  protected model: TModel;
  protected rawValue: TModel;
  protected readonly options: ParserOptions<TModel, TDescriptor>;
  public readonly field: TField;
  protected readonly descriptor: TDescriptor;

  public static register(type: ParserKind, parserClass: any) {
    PARSERS[type] = parserClass;
  }

  public static get(options: ParserOptions<any, any, any>, parent?: Parent): Parent | null {
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

  public constructor(options: ParserOptions<TModel, TDescriptor>, parent?: Parent) {
    this.parent = parent;
    this.options = options;
    this.root = parent ? parent.root : this;
    this.isRoot = !parent;
    this.isEnumItem = !!parent && parent.schema.enum instanceof Array;
    this.isArrayItem = !!parent && parent.schema.type === 'array';
    this.name = parent && !this.isEnumItem
      ? options.name
        ? parent.isRoot || this.isArrayItem
          ? options.name
          : `${parent.name}.${options.name}` : options.name
      : options.name;

    const defaultDescriptor = options.descriptorConstructor<TDescriptor>(this.schema);

    this.descriptor = options.descriptor || defaultDescriptor;
    this.rawValue = this.parseValue(this.initialValue) as any;
    this.model = this.parseValue(this.initialValue) as any;

    this.parseDescriptor();

    const self = this;
    const attrs = this.descriptor.attrs || {};
    const props = this.descriptor.props || {};
    const isRequired = parent && (parent as any).required instanceof Array
      ? (parent as any).required.includes(this.options.name)
      : this.isRoot;

    delete attrs.name;

    this.field = {
      kind: this.kind,
      name: this.name,
      isRoot: this.isRoot,
      required: isRequired,
      defaultValue: this.parseValue(options.schema.default),
      get value() {
        return self.model;
      },
      get rawValue() {
        return self.rawValue;
      },
      setValue: (value: TModel) => {
        this.setValue(value);
        this.emit();
      },
      attrs: {
        input: {
          type: undefined,
          name: this.isArrayItem && this.name ? `${this.name}[]` : this.name,
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

  public get schema() {
    return this.options.schema;
  }

  public get kind(): FieldKind {
    return this.options.schema.type;
  }

  public get type(): string | undefined {
    return undefined;
  }

  protected get initialValue() {
    if (typeof this.options.model !== 'undefined') {
      return this.options.model;
    }

    if (this.schema.hasOwnProperty('default')) {
      return this.schema.default;
    }

    return undefined;
  }

  protected get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<TDescriptor>(this.schema, this.descriptor.kind).component
      : undefined;
  }

  protected abstract parseValue(data: any): TModel | undefined;

  protected setValue(value: unknown) {
    this.rawValue = value as any;
    this.model = this.parseValue(value) as any;
  }

  protected emit() {
    if (this.options.onChange instanceof Function) {
      this.options.onChange(this.model, this.field);
    }
  }

  protected parseDescriptor() {
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

  public parse() {
    const id = this.field.attrs.input.id || UniqueId.get(this.name);
    const labelId = this.field.descriptor.label ? `${id}-label` : undefined;
    const descId = this.field.descriptor.description ? `${id}-desc` : undefined;
    const ariaLabels = [ labelId, descId ].filter((item) => item);
    const type = this.type;

    if (type) {
      (this.field.attrs.input as any).type = type;
    }

    if (!this.field.attrs.input.id) {
      this.field.attrs.input.id = id;
    }

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
