import { HelperElement } from '@/components/HelperElement';
import { FieldsetComponent } from '@/types';

export const FieldsetElement: FieldsetComponent = {
  name: 'FieldsetElement',
  functional: true,
  render(h, { data, props, slots }) {
    const attrs = props.field.attrs.input;

    attrs.disabled = props.disabled;

    const nodes = slots().default || props.field.children.map((field) => {
      return h(field.component, {
        attrs: field.attrs.input,
        props: { field }
      });
    });

    const helper = h(HelperElement, data);

    if (helper.tag) {
      nodes.unshift(helper);
    }

    if (props.field.descriptor.label) {
      const attrs = props.field.attrs.label;
      const legend = h('legend', { attrs }, props.field.descriptor.label);

      nodes.unshift(legend);
    }

    return h('fieldset', { attrs }, nodes);
  }
};
