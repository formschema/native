import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';

import {
  Field,
  InputAttributes,
  AbstractUISchemaDescriptor,
  AbstractParserOptions,
  FieldKind
} from '@/types';

export type Parent = AbstractParser<any, AbstractUISchemaDescriptor, Field<any>>;

export abstract class AbstractParser<T, X extends AbstractUISchemaDescriptor, Y extends Field<any>> {
  readonly isRoot: boolean;
  readonly isEnum: boolean;
  readonly name: string;
  readonly parent?: Parent;
  readonly model: T;
  readonly options: AbstractParserOptions<T, X>;
  readonly field: Y;
  readonly descriptor: X;

  constructor(options: AbstractParserOptions<T, X>, parent?: Parent) {
    this.isRoot = !parent;
    this.isEnum = !!parent && parent.schema.enum instanceof Array;
    this.model = this.parseValue(options.model);
    this.options = options;
    this.parent = parent;
    this.name = parent
      ? options.name
        ? parent.isRoot
          ? options.name
          : `${parent.name}.${options.name}` : UniqueId.get(parent.name, '.')
      : options.name || UniqueId.get();

    const defaultDescriptor = options.descriptorConstructor<X>(this.schema);

    this.descriptor = options.descriptor || defaultDescriptor;

    this.parseDescriptor();

    const attrs = this.descriptor.attrs || {};
    const props = this.descriptor.props || {};

    delete attrs.name;

    this.field = {
      kind: this.kind,
      isRoot: this.isRoot,
      attrs: {
        input: {
          type: undefined,
          name: this.name,
          ...attrs
        }
      },
      props: Objects.clone(props),
      descriptor: this.descriptor,
      component: this.descriptor.component || this.defaultComponent || defaultDescriptor.component,
      parent: parent ? parent.field : undefined
    } as any;
  }

  get schema() {
    return this.options.schema;
  }

  get kind(): FieldKind {
    return this.options.schema.type;
  }

  get type(): string | undefined {
    return undefined;
  }

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<X>(this.schema, this.descriptor.kind).component
      : undefined;
  }

  abstract parse(): void;
  abstract parseValue(data: any): T;

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

  protected parseInputValue() {
    if (this.model !== null) {
      (this.field.attrs.input as InputAttributes).value = this.parseValue(this.model) as any;
    } else if (this.schema.default) {
      (this.field.attrs.input as InputAttributes).value = this.parseValue(this.schema.default) as any;
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
    this.field.attrs.input.required = this.parent && (this.parent as any).required instanceof Array
      ? (this.parent as any).required.includes(this.options.name)
      : true;

    this.field.attrs.label = {
      id: labelId,
      for: id
    };

    this.field.attrs.description = {
      id: descId
    };

    if (this.field.attrs.input.required) {
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
