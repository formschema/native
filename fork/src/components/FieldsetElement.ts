import { FunctionalComponentOptions } from 'vue';
import { HelperElement } from "@/components/HelperElement";

export const FieldsetElement: FunctionalComponentOptions = {
  name: 'FieldsetElement',
  functional: true,
  render(h, { data, props }) {
    const nodes = props.field.children.map((field) => {
      return h(field.component, {
        attrs: field.attrs.input,
        props: {
          ...props,
          field: field,
          value: field.model
        }
      });
    });

    const helper = h(HelperElement, data);

    if (helper) {
      nodes.unshift(helper);
    }

    if (props.field.label) {
      const attrs = props.field.attrs.label;
      const legend = h('legend', { attrs }, props.field.label);

      nodes.unshift(legend);
    }

    return h('fieldset', {
      attrs: props.field.attrs.input
    }, nodes);
  }
};
