import { FieldsetComponent } from '@/types';
import { HelperElement } from '@/components/HelperElement';
import { FieldElement } from '@/components/FieldElement';
import { Objects } from '@/lib/Objects';
import { Groups } from '@/lib/Groups';

export const FieldsetElement: FieldsetComponent = {
  name: 'FieldsetElement',
  functional: true,
  render(h, { data, props, slots }) {
    const descriptor = props.field.descriptor;
    const groups = descriptor.groups;
    const nodes = descriptor.kind === 'object' && groups && !Objects.isEmpty(groups)
      ? Groups.renderGroups(h, props.field)
      : slots().default || Groups.renderChildren(h, props.field.children);

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
