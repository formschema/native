import { FunctionalComponentOptions } from 'vue';

export const HelperElement = {
  name: 'HelperElement',
  functional: true,
  render(h, { props }) {
    if (props.field.description) {
      return h('span', {
        attrs: props.field.attrs.description
      }, props.field.description);
    }
    return null;
  }
} as FunctionalComponentOptions;
