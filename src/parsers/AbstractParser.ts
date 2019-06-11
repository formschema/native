import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';

import {
  Field,
  AbstractUISchemaDescriptor,
  AbstractParserOptions,
  FieldKind,
  UnknowField
} from '@/types';

export type Parent = AbstractParser<any, AbstractUISchemaDescriptor, UnknowField>;

export abstract class AbstractParser<
  TModel,
  TDescriptor extends AbstractUISchemaDescriptor,
  TField extends Field<any>
> {
  protected readonly isRoot: boolean;
  protected readonly isEnumItem: boolean;
  protected readonly isArrayItem: boolean;
  protected readonly name?: string;
  protected readonly parent?: Parent;
  protected readonly root: Parent;
  protected model: TModel;
  protected readonly options: AbstractParserOptions<TModel, TDescriptor>;
  public readonly field: TField;
  protected readonly descriptor: TDescriptor;

  public constructor(options: AbstractParserOptions<TModel, TDescriptor>, parent?: Parent) {
    this.parent = parent;
    this.options = options;
    this.root = parent ? parent.root || this : this;
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
    this.model = this.parseValue(this.initialValue);

    this.parseDescriptor();

    const self = this;
    const attrs = this.descriptor.attrs || {};
    const props = this.descriptor.props || {};
    const isRequired = parent && (parent as any).required instanceof Array
      ? (parent as any).required.includes(this.options.name)
      : true;

    delete attrs.name;

    this.field = {
      name: this.name,
      kind: this.kind,
      isRoot: this.isRoot,
      required: isRequired,
      default: this.parseValue(options.schema.default),
      set: (value: TModel) => {
        if (this.isEnumItem) {
          this.setEnumValue(value);
        } else {
          this.setValue(value);
        }

        options.$vue.$emit('input', this.root.model);
      },
      get model() {
        return self.model;
      },
      set model(value: TModel) {
        self.model = value;

        if (parent) {
          if (parent.schema.type === 'object') {
            const parentModel = parent.field.model as any;

            parentModel[options.name as string] = self.model;

            // options.$vue.$set(parent.field.model, options.name as string, self.model);
          } else {
            // console.log('unset:>', { value, parent });
          }
        } else {
          // console.log('unset:>', { value, parent });
        }
      },
      attrs: {
        input: {
          type: undefined,
          name: this.isArrayItem && this.name ? `${this.name}[]` : this.name,
          ...attrs
        }
      },
      props: Objects.clone(props),
      descriptor: this.descriptor,
      component: this.descriptor.component || this.defaultComponent || defaultDescriptor.component,
      parent: parent ? parent.field : undefined
    } as any;
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

  protected get parsedSchema() {
    return this.options.schema;
  }

  public abstract parse(): void;

  protected abstract parseValue(data: any): TModel;

  protected setValue(value: TModel) {
    this.field.model = this.parseValue(value);
  }

  protected setEnumValue(value: TModel) {
    if (this.parent) {
      this.parent.field.model = value;
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

  protected parseField() {
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

    this.field.attrs.label = {
      id: labelId,
      for: id
    };

    this.field.attrs.description = {
      id: descId
    };

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
