import { VNode } from 'vue';
import { ArrayComponent } from '@/types';
import { FieldElement } from '@/components/FieldElement';
import { FieldsetElement } from '@/components/FieldsetElement';

export const ArrayElement: ArrayComponent = {
  name: 'ArrayElement',
  functional: true,
  render(h, { data, props }) {
    const ArrayButtonElement = props.field.descriptor.components.get('button');
    const nodes: any = props.field.descriptor.children.map((descriptor, index) => {
      const field = props.field.childrenList[index];
      const buttonsWrapper: VNode[] = [];

      if (!props.field.uniqueItems && props.field.sortable) {
        const buttonsNodes = descriptor.buttons.map((button) => h(ArrayButtonElement, {
          props: { button, field }
        }));

        buttonsWrapper.push(h('div', {
          key: props.field.key + field.key,
          attrs: {
            'data-fs-buttons': buttonsNodes.length
          }
        }, buttonsNodes));
      }

      if (descriptor.kind === 'object') {
        return h(FieldElement, {
          props: {
            field: { ...field, helper: {} } // remove the duplicate bottom helper
          }
        }, [
          h(descriptor.component, {
            key: field.key,
            props: { field }
          }),
          buttonsWrapper
        ]);
      }

      return h(descriptor.component, {
        key: field.key,
        attrs: descriptor.attrs,
        props: { field }
      }, buttonsWrapper);
    });

    if (!props.field.uniqueItems) {
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
