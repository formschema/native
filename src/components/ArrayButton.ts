import { ArrayButtonComponent } from '@/types';

export const ArrayButton: ArrayButtonComponent = {
  functional: true,
  name: 'ArrayButton',
  render(h, { props }) {
    const button = props.field.buttons.push;

    return h('button', {
      attrs: {
        type: 'button',
        disabled: button.disabled
      },
      on: {
        click: () => button.push()
      }
    }, button.label);
  }
};
