import { CreateElement } from 'vue';
import { IObjectDescriptor, IObjectChildDescriptor } from '@/types';

export const Elements = {
  renderChildren: (h: CreateElement, descriptor: IObjectDescriptor, children: IObjectChildDescriptor[]) => {
    return children.map((childDescriptor) => h(childDescriptor.component, {
      key: childDescriptor.field.key,
      attrs: descriptor.attrs,
      props: {
        field: childDescriptor.field,
        descriptor: childDescriptor
      }
    }));
  },

  renderGroups: (h: CreateElement, descriptor: IObjectDescriptor) => {
    return descriptor.childrenGroups.map(({ id, label, children }) => {
      const childrenNodes = Elements.renderChildren(h, descriptor, children);
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
