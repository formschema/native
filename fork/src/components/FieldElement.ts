import { FunctionalComponentOptions } from 'vue';
import { HelperElement } from "@/components/HelperElement";

export const FieldElement: FunctionalComponentOptions = {
  name: 'FieldElement',
  functional: true,
  render(h, { data, props, slots }) {
    const attrs = {
      'data-fs-field': props.field.attrs.input.id,
      'data-fs-required': props.field.attrs.input.required
    };

    const labelElement = h('label', {
      attrs: props.field.attrs.label
    }, props.field.label);

    const fieldElement = h('div', {
      attrs: {
        'data-fs-field-input': true
      }
    }, [
      ...slots().default,
      h(HelperElement, data)
    ]);

    const nodes = [ labelElement, fieldElement ];

    return h('div', { attrs }, nodes);
  }
};
