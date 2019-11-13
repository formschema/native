import { ArrayButtonComponent } from '@/types';

export const ArrayButtonElement: ArrayButtonComponent = {
  functional: true,
  name: 'ArrayButtonElement',
  render(h, { props: { button, field } }) {
    return h('button', {
      attrs: {
        type: 'button',
        title: button.tooltip,
        disabled: button.disabled,
        'data-fs-button': button.type
      },
      on: {
        click: button.trigger
      }
    }, button.label);
  }
};
