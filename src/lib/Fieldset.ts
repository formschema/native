import { CreateElement } from 'vue';
import { ObjectField, ObjectFieldChild } from '@/types';

export const Fieldset = {
  renderChildren(h: CreateElement, field: ObjectField, children: ObjectFieldChild[] = field.children) {
    return children
      .filter((childField) => childField.descriptor.visible)
      .map((childField) => h(childField.descriptor.component, {
        key: childField.key,
        attrs: childField.descriptor.attrs,
        props: {
          field: childField
        }
      }));
  },

  renderGroups(h: CreateElement, field: ObjectField) {
    return field.descriptor.childrenGroups.map(({ id, label, children }) => {
      const childrenNodes = Fieldset.renderChildren(h, field, children);
      const nodes = [
        h('div', {
          attrs: {
            'data-fs-group-nodes': childrenNodes.length
          }
        }, childrenNodes)
      ];

      if (label) {
        nodes.unshift(h('div', {
          attrs: {
            'data-fs-group-label': id
          }
        }, label));
      }

      return h('div', {
        attrs: {
          'data-fs-group': id
        }
      }, nodes);
    });
  }
};
