import { VNode } from 'vue';
import { FieldsetElement } from '@/components/FieldsetElement';
import { ArrayButton } from '@/components/ArrayButton';
import { ArrayComponent } from '@/types';

const BUTTONS = [ 'clear', 'moveUp', 'moveDown', 'delete' ];

export const ArrayElement: ArrayComponent = {
  name: 'ArrayElement',
  functional: true,
  render(h, { data, props }) {
    const nodes: any = props.field.children.map((field) => {
      const buttonsWrapper: VNode[] = [];

      if (!props.field.uniqueItems && props.field.sortable) {
        const buttons = field.buttons as any;
        const buttonsNodes = BUTTONS.map((type) => h(ArrayButton, {
          props: buttons[type]
        }));

        buttonsWrapper.push(h('div', {
          key: props.field.key + field.key,
          attrs: {
            'data-fs-buttons': true
          }
        }, buttonsNodes));
      }

      return h(field.input.component, {
        attrs: field.input.attrs,
        props: { field }
      }, buttonsWrapper);
    });

    if (!props.field.uniqueItems) {
      nodes.push(h(ArrayButton, {
        props: props.field.pushButton
      }));
    }

    return h(FieldsetElement, data, nodes);
  }
};
