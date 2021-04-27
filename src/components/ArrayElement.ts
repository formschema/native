import { VNode, VNodeData } from 'vue';
import { ArrayComponent } from '@/types';
import { FieldElement } from '@/components/FieldElement';
import { FieldsetElement } from '@/components/FieldsetElement';

export const ArrayElement: ArrayComponent = {
  name: 'ArrayElement',
  functional: true,
  render(h, { data, props }): VNode | VNode[] {
    const ArrayButtonElement = props.field.descriptor.components.get('button');
    const nodes = props.field.children.map((childField) => {
      const childDescriptor = childField.descriptor;
      const buttonsWrapper: VNode[] = [];
      const childData: VNodeData = {
        key: childField.key,
        attrs: childDescriptor.attrs,
        props: { field: childField }
      };

      if (!props.field.uniqueItems && props.field.sortable) {
        if (childDescriptor.buttons.length && props.field.value.length > 1) {
          const buttons = childDescriptor.buttons;
          const buttonsNodes = buttons.map((button) => h(button.component || ArrayButtonElement, {
            props: { button, field: childField }
          }));

          buttonsWrapper.push(h('div', {
            key: props.field.key + childField.key,
            attrs: {
              'data-fs-buttons': buttonsNodes.length
            }
          }, buttonsNodes));
        }
      }

      if (childDescriptor.kind === 'object') {
        const componentNode = h(FieldsetElement, childData);
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

    if (!props.field.uniqueItems && props.field.children.length < props.field.maxItems) {
      if (props.field.descriptor.definition.pushButton !== null) {
        nodes.push(h(props.field.descriptor.pushButton.component || ArrayButtonElement, {
          props: {
            button: props.field.descriptor.pushButton,
            field: props.field
          }
        }));
      }
    }

    return h(FieldsetElement, data, nodes);
  }
};
