import { CreateElement } from 'vue';
import { ObjectFieldChild, ObjectField, Dictionary } from '@/types';
import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';

export const Groups = {
  parse(field: ObjectField) {
    const definedGroups = field.descriptor.groups ? field.descriptor.groups : {};
    const ordoredGroups: Dictionary<string[]> = {};
    const properties = field.children.map(({ property }) => property);
    const order: string[] = [];

    if (Objects.isEmpty(definedGroups)) {
      const groupId = UniqueId.get(field.name);

      ordoredGroups[groupId] = properties;

      order.push(groupId);
    } else {
      const reverseGroups: Dictionary<string> = {};

      // setting the reverse groups cache
      for (const groupId in definedGroups) {
        definedGroups[groupId].properties.forEach((property) => {
          reverseGroups[property] = groupId;
        });
      }

      // generate groups
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        const groupId = reverseGroups[property] || UniqueId.get(field.name);

        if (definedGroups[groupId]) {
          if (!ordoredGroups[groupId]) {
            order.push(groupId);

            ordoredGroups[groupId] = definedGroups[groupId].properties;
          }
        } else {
          let j = i;

          ordoredGroups[groupId] = [];

          order.push(groupId);

          do {
            ordoredGroups[groupId].push(properties[j]);
          } while (++j < properties.length && !reverseGroups[properties[j]]);

          i = j - 1;
        }
      }
    }

    return order.map((groupId) => ({
      id: groupId,
      label: definedGroups[groupId] ? definedGroups[groupId].label : undefined,
      properties: ordoredGroups[groupId]
    }));
  },

  renderChildren: (h: CreateElement, children: ObjectFieldChild[]) => {
    return children.map((field: ObjectFieldChild) => h(field.input.component, {
      key: field.key,
      props: { field }
    }));
  },

  renderGroups: (h: CreateElement, field: ObjectField) => {
    return Groups.parse(field).map(({ id, label, properties }) => {
      const children = properties.map((item) => {
        return field.children.find(({ property }) => property === item) as ObjectFieldChild;
      });

      const childrenNodes = Groups.renderChildren(h, children);
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
