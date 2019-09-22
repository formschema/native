import { NativeElements } from '@/lib/NativeElements';
import { Components } from '@/lib/Components';

import {
  Dict,
  IDescriptor,
  FieldKind,
  UnknowField,
  Component,
  HelperAttributes,
  LabelAttributes,
  SchemaDescriptor
} from '@/types';

const DESCRIPTORS: Dict<any> = {};

export abstract class UIDescriptor<TField extends UnknowField> implements IDescriptor {
  readonly label: string;
  readonly helper: string;
  readonly field: TField;
  readonly component: Component;
  readonly props: Dict;
  readonly attrs: Dict<any>;
  readonly labelAttrs: LabelAttributes;
  readonly helperAttrs: HelperAttributes;
  readonly components: Components;

  static register(kind: FieldKind, parserClass: any) {
    DESCRIPTORS[kind] = parserClass;
  }

  static get<
    T extends SchemaDescriptor = SchemaDescriptor
  >(options: T, field: Readonly<UnknowField>, components?: Components): IDescriptor {
    if (!DESCRIPTORS.hasOwnProperty(field.kind)) {
      throw new TypeError(`Unknow descriptor kind '${field.kind}'`);
    }

    return new DESCRIPTORS[field.kind](options, field, components);
  }

  constructor(options: SchemaDescriptor, field: TField, components?: Components) {
    this.field = field;
    this.attrs = options.attrs || {};
    this.props = options.props || {};
    this.components = components || NativeElements;
    this.component = options.component || this.components.get(this.kind) || NativeElements.get(this.kind);

    for (const key in this.attrs) {
      this.field.attrs[key] = this.attrs[key];
    }

    this.label = options.hasOwnProperty('label')
      ? options.label || ''
      : field.schema.title || '';

    this.helper = options.hasOwnProperty('helper')
      ? options.helper || ''
      : field.schema.description || '';

    const self = this;

    this.labelAttrs = {
      get id() {
        return self.label ? `${field.attrs.id}-label` : undefined;
      },
      get for() {
        return field.attrs.id;
      }
    };

    this.helperAttrs = {
      get id() {
        return self.helper ? `${field.attrs.id}-helper` : undefined;
      }
    };

    /**
     * Use the WAI-ARIA aria-labelledby and aria-describedby attributes to
     * associate instructions with form controls
     * @see https://www.w3.org/WAI/tutorials/forms/instructions/#providing-instructions-outside-labels
     */
    Object.defineProperties(this.field.attrs, {
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

  get kind() {
    return this.field.kind;
  }
}
