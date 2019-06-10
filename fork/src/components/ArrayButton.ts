import { FunctionalComponentOptions } from 'vue';

export const ArrayButton: FunctionalComponentOptions = {
  functional: true,
  name: 'ArrayButton',
  render(h, { props }) {
    return h('button', {
      attrs: {
        type: 'button',
        disabled: props.field.count === props.field.max
      },
      props: props,
      on: {
        click() {
          props.field.count++;
        }
      }
    }, props.field.descriptor.addButtonLabel);
  }
};
