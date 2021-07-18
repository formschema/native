import { VNode } from 'vue';
import { ArrayButtonComponent } from '../../types';

export const ArrayButtonElement: ArrayButtonComponent = {
  functional: true,
  name: 'ArrayButtonElement',
  render(h, { props: { button } }): VNode | VNode[] {
    return h('button', {
      attrs: {
        type: 'button',
        title: button.tooltip,
        disabled: button.disabled,
        'data-fs-button': button.type
      },
      on: {
        click: button.trigger as any
      }
    }, button.label);
  }
};
