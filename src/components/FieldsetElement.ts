import { HelperElement } from '@/components/HelperElement';
import { FieldsetComponent } from '@/types';
import { FieldElement } from './FieldElement';

export const FieldsetElement: FieldsetComponent = {
  name: 'FieldsetElement',
  functional: true,
  render(h, { data, props, slots }) {
    const nodes = slots().default || props.field.children.map((field) => {
      return h(field.input.component, {
        key: field.key,
        props: { field }
      });
    });

    if (!props.field.isRoot) {
      return h(FieldElement, data, nodes);
    }

    const attrs = props.field.input.attrs;
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
