import { FieldsetComponent } from '@/types';
import { HelperElement } from '@/components/HelperElement';
import { FieldElement } from '@/components/FieldElement';
import { Objects } from '@/lib/Objects';
import { Elements } from '@/lib/Elements';

export const FieldsetElement: FieldsetComponent = {
  name: 'FieldsetElement',
  functional: true,
  render(h, { data, props, slots }) {
    const descriptor = props.descriptor;
    const nodes = descriptor.kind === 'object' && !Objects.isEmpty(descriptor.groups)
      ? Elements.renderGroups(h, descriptor)
      : slots().default || Elements.renderChildren(h, descriptor, descriptor.children);

    if (!props.field.isRoot) {
      return h(FieldElement, data, nodes);
    }

    const attrs = props.field.attrs;
    const helper = h(HelperElement, data);

    if (helper.tag) {
      nodes.unshift(helper);
    }

    if (descriptor.label) {
      const attrs = descriptor.labelAttrs;
      const legend = h('legend', { attrs }, descriptor.label);

      nodes.unshift(legend);
    }

    return h('fieldset', { attrs }, nodes);
  }
};
