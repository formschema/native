import { VNode } from 'vue';
import { CreateElement, ObjectField, ObjectFieldChild } from '../../types';

function renderChildren(h: CreateElement, field: ObjectField, children: ObjectFieldChild[]): VNode[] {
  return children
    .filter((childField) => childField.descriptor.visible)
    .map((childField) => h(childField.descriptor.component, {
      key: childField.key,
      attrs: childField.descriptor.attrs,
      props: {
        field: childField
      }
    }));
}

export const Fieldset = {
  renderChildren(h: CreateElement, field: ObjectField): VNode[] {
    if (field.descriptor.childrenGroups instanceof Array) {
      return field.descriptor.childrenGroups.map(({ children }) => renderChildren(h, field, children)).flat();
    }

    return renderChildren(h, field, field.children);
  },

  renderGroups(h: CreateElement, field: ObjectField): VNode[] {
    return field.descriptor.childrenGroups.map(({ id, label, children }) => {
      const childrenNodes = renderChildren(h, field, children);
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
