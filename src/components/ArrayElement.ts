import { VNode } from 'vue';
import { ArrayComponent } from '@/types';
import { ArrayButton } from '@/components/ArrayButton';
import { FieldElement } from '@/components/FieldElement';
import { FieldsetElement } from '@/components/FieldsetElement';

export const ArrayElement: ArrayComponent = {
  name: 'ArrayElement',
  functional: true,
  render(h, { data, props }) {
    const nodes: any = props.descriptor.children
      .map((descriptor) => {
        const field = descriptor.field;
        const buttonsWrapper: VNode[] = [];

        if (!props.field.uniqueItems && props.field.sortable) {
          const buttonsNodes = descriptor.buttons.map((button) => h(ArrayButton, {
            props: button
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
              props: { field, descriptor }
            }),
            buttonsWrapper
          ]);
        }

        return h(descriptor.component, {
          attrs: descriptor.attrs,
          props: { field, descriptor }
        }, buttonsWrapper);
      });

    if (!props.field.uniqueItems) {
      nodes.push(h(ArrayButton, {
        props: props.descriptor.pushButton
      }));
    }

    return h(FieldsetElement, data, nodes);
  }
};
