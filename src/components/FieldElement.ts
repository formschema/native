import { HelperElement } from '@/components/HelperElement';
import { Dictionary, FieldComponent } from '@/types';

export const FieldElement: FieldComponent = {
  name: 'FieldElement',
  functional: true,
  render(h, { data, props, children }) {
    const field = props.field;
    const type = field.input.attrs.type || field.kind;
    const attrs: Dictionary = {
      'data-fs-kind': field.kind,
      'data-fs-type': type,
      'data-fs-field': field.name,
      'data-fs-required': field.required,
      'data-fs-horizontal': field.input.props.horizontal
    };

    const labelElement = h('label', {
      attrs: field.label.attrs
    }, field.label.value);

    const fieldElement = h('div', {
      attrs: {
        'data-fs-input': type
      }
    }, children);

    const nodes = [ fieldElement ];
    const helperNode = h(HelperElement, data);

    if (helperNode.tag) {
      nodes.push(helperNode);
    }

    const wrapperElement = nodes.length === 1
      ? nodes
      : h('div', {
        attrs: {
          'data-fs-wrapper': nodes.length
        }
      }, nodes);

    return h('div', { attrs }, [ labelElement, wrapperElement ]);
  }
};
