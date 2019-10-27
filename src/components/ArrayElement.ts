import { VNode } from 'vue';
import { ArrayComponent } from '@/types';
import { FieldElement } from '@/components/FieldElement';
import { FieldsetElement } from '@/components/FieldsetElement';

export const ArrayElement: ArrayComponent = {
  name: 'ArrayElement',
  functional: true,
  render(h, { data, props }) {
    const ArrayButtonElement = props.descriptor.components.get('button');
    const nodes: any = props.descriptor.children.map((descriptor) => {
      const field = descriptor.field;
      const buttonsWrapper: VNode[] = [];

      if (!props.field.uniqueItems && props.field.sortable) {
        const buttonsNodes = descriptor.buttons.map((button) => h(ArrayButtonElement, {
          props: {
            button, field, descriptor
          }
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
            descriptor,
            field: { ...field, helper: {} } // remove the duplicate bottom helper
          }
        }, [
          h(descriptor.component, {
            key: field.key,
            props: { field, descriptor }
          }),
          buttonsWrapper
        ]);
      }

      return h(descriptor.component, {
        key: field.key,
        attrs: descriptor.attrs,
        props: { field, descriptor }
      }, buttonsWrapper);
    });

    if (!props.field.uniqueItems) {
      nodes.push(h(ArrayButtonElement, {
        props: {
          button: props.descriptor.pushButton,
          field: props.field,
          descriptor: props.descriptor
        }
      }));
    }

    return h(FieldsetElement, data, nodes);
  }
};
