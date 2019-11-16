import { VNode } from 'vue';
import { ArrayComponent } from '@/types';
import { FieldElement } from '@/components/FieldElement';
import { FieldsetElement } from '@/components/FieldsetElement';

export const ArrayElement: ArrayComponent = {
  name: 'ArrayElement',
  functional: true,
  render(h, { data, props }) {
    const ArrayButtonElement = props.field.descriptor.components.get('button');
    const nodes: any = props.field.descriptor.children.map((childDescriptor, index) => {
      const buttonsWrapper: VNode[] = [];

      const childField = props.field.childrenList[index];
      const childData = {
        key: childField.key,
        attrs: childDescriptor.attrs,
        props: { field: childField }
      };

      if (!props.field.uniqueItems && props.field.sortable) {
        const buttons = childDescriptor.buttons;
        const buttonsNodes = buttons.map((button) => h(ArrayButtonElement, {
          props: { button, field: childField }
        }));

        buttonsWrapper.push(h('div', {
          key: props.field.key + childField.key,
          attrs: {
            'data-fs-buttons': buttonsNodes.length
          }
        }, buttonsNodes));
      }

      if (childDescriptor.kind === 'object') {
        const componentNode = h(childDescriptor.component, childData);
        const fieldsetData = {
          props: {
            // TODO this sounds deprecated. The field object no longer has a helper property
            field: { ...childField, helper: {} } // remove the duplicate bottom helper
          }
        };

        return h(FieldElement, fieldsetData, [ componentNode, buttonsWrapper ]);
      }

      return h(childDescriptor.component, childData, buttonsWrapper);
    });

    if (!props.field.uniqueItems && props.field.maxItems > 1) {
      nodes.push(h(ArrayButtonElement, {
        props: {
          button: props.field.descriptor.pushButton,
          field: props.field
        }
      }));
    }

    return h(FieldsetElement, data, nodes);
  }
};
