import { HelperElement } from '@/components/HelperElement';
import { Dictionary, FieldComponent } from '@/types';

export const FieldElement: FieldComponent = {
  name: 'FieldElement',
  functional: true,
  render(h, { data, props, children }) {
    const attrs: Dictionary = {
      'data-fs-kind': props.field.kind,
      'data-fs-field': props.field.name,
      'data-fs-required': props.field.required
    };

    const labelElement = h('label', {
      attrs: props.field.label.attrs
    }, props.field.label.value);

    const fieldNodes = [ ...children, h(HelperElement, data) ];
    const fieldElement = h('div', {
      attrs: {
        'data-fs-input': props.field.input.attrs.type || props.field.kind
      }
    }, fieldNodes);

    const nodes = [ labelElement, fieldElement ];

    return h('div', { attrs }, nodes);
  }
};
