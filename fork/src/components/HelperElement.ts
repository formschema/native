import { FunctionalComponentOptions } from 'vue';

export const HelperElement = {
  name: 'HelperElement',
  functional: true,
  render(h, { props }) {
    if (props.field.descriptor.description) {
      const tag = props.field.isRoot ? 'p' : 'span';
      const data = {
        attrs: props.field.attrs.description
      };

      return h(tag, data, props.field.descriptor.description);
    }

    return null;
  }
} as FunctionalComponentOptions;
