import { FunctionalComponentOptions } from 'vue';
import { HelperElement } from "@/components/HelperElement";

export const FieldElement: FunctionalComponentOptions = {
  name: 'FieldElement',
  functional: true,
  render(h, { data, props, slots }) {
    const attrs = {
      'data-fs-kind': props.field.kind,
      'data-fs-field': props.field.attrs.input.name,
      'data-fs-required': props.field.attrs.input.required
    };

    const labelElement = h('label', {
      attrs: props.field.attrs.label
    }, props.field.descriptor.label);

    const fieldElement = h('div', {
      attrs: {
        'data-fs-input': props.field.attrs.input.type || props.field.kind
      }
    }, [
      ...slots().default,
      h(HelperElement, data)
    ]);

    const nodes = [ labelElement, fieldElement ];

    return h('div', { attrs }, nodes);
  }
};
