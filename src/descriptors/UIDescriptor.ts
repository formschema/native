import { NativeElements } from '@/lib/NativeElements';
import { JsonSchema } from '@/types/jsonschema';

import {
  Dict,
  IUIDescriptor,
  FieldKind,
  UnknowField,
  Component,
  HelperAttributes,
  LabelAttributes,
  DescriptorDefinition,
  IComponents
} from '@/types';

const DESCRIPTORS: Dict<any> = {};

export abstract class UIDescriptor<
  TField extends UnknowField,
  TDescriptorDefinition extends DescriptorDefinition,
  TFieldKind extends FieldKind = FieldKind
> implements IUIDescriptor<TDescriptorDefinition> {
  readonly label: string;
  readonly helper: string;
  readonly component: Component;
  readonly props: Dict;
  readonly attrs: Dict<any>;
  readonly labelAttrs: LabelAttributes;
  readonly helperAttrs: HelperAttributes;
  readonly components: IComponents;
  readonly definition: TDescriptorDefinition;
  readonly visible: boolean;
  readonly kind: TFieldKind;
  readonly schema: JsonSchema;

  static register(kind: FieldKind, parserClass: Dict<any>): void {
    DESCRIPTORS[kind] = parserClass;
  }

  static get<
    T extends DescriptorDefinition = DescriptorDefinition
  >(options: T | ((f: UnknowField) => T), field: Readonly<UnknowField>, components?: IComponents): IUIDescriptor {
    if (!DESCRIPTORS.hasOwnProperty(field.kind)) {
      throw new TypeError(`Unknow descriptor kind '${field.kind}'`);
    }

    if (typeof options === 'function') {
      options = options(field);
    }

    return new DESCRIPTORS[field.kind](options, field, components);
  }

  constructor(definition: TDescriptorDefinition, field: TField, components?: IComponents) {
    this.visible = typeof definition.visible === 'boolean' ? definition.visible : true;
    this.kind = field.kind;
    this.attrs = { ...field.attrs, ...(definition.attrs || {}) };
    this.props = definition.props || {};
    this.components = components || NativeElements;
    this.component = definition.component || this.components.get(this.kind) || NativeElements.get(this.kind);
    this.schema = field.schema;
    this.definition = definition;

    this.label = definition.hasOwnProperty('label')
      ? definition.label || ''
      : field.schema.title || '';

    this.helper = definition.hasOwnProperty('helper')
      ? definition.helper || ''
      : field.schema.description || '';

    this.labelAttrs = {
      id: this.label ? `${this.attrs.id}-label` : undefined,
      for: this.attrs.id as string
    };

    this.helperAttrs = {
      id: this.helper ? `${this.attrs.id}-helper` : undefined
    };

    /**
     * Use the WAI-ARIA aria-labelledby and aria-describedby attributes to
     * associate instructions with form controls
     * @see https://www.w3.org/WAI/tutorials/forms/instructions/#providing-instructions-outside-labels
     */
    this.attrs['aria-labelledby'] = this.labelAttrs.id;
    this.attrs['aria-describedby'] = this.helperAttrs.id;
  }

  parse(field: TField): void {
    // Make sure descriptor.attrs is sync with field.attrs
    Object.assign(this.attrs, field.attrs, this.definition.attrs || {});
  }

  // eslint-disable-next-line
  update(field: TField): void {
    // do nothing by default, inherited class will override this if needed
  }
}
