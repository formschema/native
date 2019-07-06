import { ArrayButtonComponent } from '@/types';

export const ArrayButton: ArrayButtonComponent = {
  functional: true,
  name: 'ArrayButton',
  render(h, { props }) {
    return h('button', {
      attrs: {
        type: 'button',
        disabled: props.field.buttons.add.disabled
      },
      props: props,
      on: {
        click: () => props.field.buttons.add.push()
      }
    }, props.field.descriptor.addButtonLabel);
  }
};
