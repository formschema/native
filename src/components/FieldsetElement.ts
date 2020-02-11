import { FieldsetComponent } from '@/types';
import { FieldElement } from '@/components/FieldElement';
import { Objects } from '@/lib/Objects';
import { Fieldset } from '@/lib/Fieldset';
import { Field } from '@/lib/Field';

export const FieldsetElement: FieldsetComponent = {
  name: 'FieldsetElement',
  functional: true,
  render(h, { data, props, slots }) {
    const field = props.field;
    const descriptor = props.field.descriptor;

    const nodes = descriptor.kind === 'object' && !Objects.isEmpty(descriptor.groups)
      ? Fieldset.renderGroups(h, field)
      : slots().default || Fieldset.renderChildren(h, field);

    if (descriptor.definition.kind === 'hidden') {
      return nodes;
    }

    if (!field.isRoot) {
      return h(descriptor.definition.layout || FieldElement, data, nodes);
    }

    const attrs = { ...descriptor.attrs, ...(data.attrs || {}) };
    const helper = h(descriptor.components.get('helper'), data);

    // avoid rendering of <!-- --> by only confidering defined herper
    if (helper.tag) {
      nodes.unshift(helper);
    }

    if (descriptor.label && descriptor.layout === 'fieldset') {
      const attrs = descriptor.labelAttrs;
      const legend = h('legend', { attrs }, descriptor.label);

      nodes.unshift(legend);
    }

    Field.renderMessages(h, field, nodes, field.isRoot);

    return h(descriptor.layout, { props, attrs }, nodes);
  }
};
