import { HelperElement } from '@/components/HelperElement';
import { FieldsetComponent } from '@/types';

export const FieldsetElement: FieldsetComponent = {
  name: 'FieldsetElement',
  functional: true,
  render(h, { data, props, slots }) {
    const attrs = props.field.input.attrs;

    attrs.disabled = props.disabled;

    const nodes = slots().default || props.field.children.map((field) => {
      return h(field.input.component, {
        props: { field }
      });
    });

    const helper = h(HelperElement, data);

    if (helper.tag) {
      nodes.unshift(helper);
    }

    if (props.field.label.value) {
      const attrs = props.field.label.attrs;
      const legend = h('legend', { attrs }, props.field.label.value);

      nodes.unshift(legend);
    }

    return h('fieldset', { attrs }, nodes);
  }
};
