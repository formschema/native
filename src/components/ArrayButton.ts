import { ArrayButtonComponent } from '@/types';

export const ArrayButton: ArrayButtonComponent = {
  functional: true,
  name: 'ArrayButton',
  render(h, { props }) {
    return h('button', {
      attrs: {
        type: 'button',
        title: props.tooltip,
        disabled: props.disabled,
        'data-fs-button': props.type
      },
      domProps: {
        innerHTML: props.label
      },
      on: {
        click: props.trigger
      }
    });
  }
};
