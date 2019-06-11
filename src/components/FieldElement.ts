import { HelperElement } from "@/components/HelperElement";
import { Dictionary, FieldComponent } from '@/types';

export const FieldElement: FieldComponent = {
  name: 'FieldElement',
  functional: true,
  render(h, { data, props, slots }) {
    const attrs: Dictionary = {
      'data-fs-kind': props.field.kind,
      'data-fs-field': props.field.name,
      'data-fs-required': props.field.required
    };

    const labelElement = h('label', {
      attrs: props.field.attrs.label
    }, props.field.descriptor.label);

    const fieldNodes = [
      ...slots().default,
      h(HelperElement, data)
    ];

    const fieldElement = h('div', {
      attrs: {
        'data-fs-input': (props.field.attrs.input as any).type || props.field.kind
      }
    }, fieldNodes);

    const nodes = [ labelElement, fieldElement ];

    return h('div', { attrs }, nodes);
  }
};
