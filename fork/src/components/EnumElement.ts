import { FunctionalComponentOptions } from 'vue';
import { HelperElement } from "@/components/HelperElement";

export const EnumElement: FunctionalComponentOptions = {
  name: 'EnumElement',
  functional: true,
  render(h, { data, props }) {
    const { components } = props;

    const nodes = props.field.fields.map(({ field }) => {
      const type = field.kind;

      return h(components.get(type), {
        attrs: field.attrs.input,
        props: {
          field: field,
          value: field.model,
          components: props.components
        }
      });
    });

    const helper = h(HelperElement, data);

    if (helper) {
      nodes.unshift(helper);
    }

    if (props.field.label) {
      const legend = h('legend', {
        attrs: props.field.attrs.label
      }, props.field.label);

      nodes.unshift(legend);
    }

    return h('fieldset', {
      attrs: props.field.attrs.input
    }, nodes);
  }
};
