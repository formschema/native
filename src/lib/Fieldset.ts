import { CreateElement } from 'vue';
import { IObjectChildDescriptor, ObjectField, ObjectFieldChild } from '@/types';

export const Fieldset = {
  renderChildren(h: CreateElement, field: ObjectField, children: ObjectFieldChild[] = field.childrenList) {
    return children
      .map((childField) => ({
        childField,
        childDescriptor: field.descriptor.getChildDescriptor(childField),
      }))
      .filter(({ childDescriptor }) => childDescriptor.visible)
      .map(({ childDescriptor, childField }) => h(childDescriptor.component, {
        key: childField.key,
        attrs: childDescriptor.attrs,
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
