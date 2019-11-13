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
  TDescriptor extends DescriptorDefinition,
  TFieldKind extends FieldKind = FieldKind
> implements IUIDescriptor<TDescriptor> {
  readonly label: string;
  readonly helper: string;
  readonly component: Component;
  readonly props: Dict;
  readonly attrs: Dict<any>;
  readonly labelAttrs: LabelAttributes;
  readonly helperAttrs: HelperAttributes;
  readonly components: IComponents;
  readonly definition: TDescriptor;
  readonly visible: boolean;
  readonly kind: TFieldKind;
  readonly schema: JsonSchema;

  static register(kind: FieldKind, parserClass: any) {
    DESCRIPTORS[kind] = parserClass;
  }

  static get<
    T extends DescriptorDefinition = DescriptorDefinition
  >(options: T, field: Readonly<UnknowField>, components?: IComponents): IUIDescriptor {
    if (!DESCRIPTORS.hasOwnProperty(field.kind)) {
      throw new TypeError(`Unknow descriptor kind '${field.kind}'`);
    }

    return new DESCRIPTORS[field.kind](options, field, components);
  }

  constructor(definition: TDescriptor, field: TField, components?: IComponents) {
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
      get id() {
        return definition.label ? `${field.attrs.id}-label` : undefined;
      },
      get for() {
        return field.attrs.id as string;
      }
    };

    this.helperAttrs = {
      get id() {
        return field.descriptor.helper ? `${field.attrs.id}-helper` : undefined;
      }
    };

    /**
     * Use the WAI-ARIA aria-labelledby and aria-describedby attributes to
     * associate instructions with form controls
     * @see https://www.w3.org/WAI/tutorials/forms/instructions/#providing-instructions-outside-labels
     */
    Object.defineProperties(this.attrs, {
      'aria-labelledby': {
        enumerable: true,
        configurable: true,
        get: () => this.labelAttrs.id
      },
      'aria-describedby': {
        enumerable: true,
        configurable: true,
        get: () => this.helperAttrs.id
      }
    });
  }

  parse(field: TField) {
  }
}
