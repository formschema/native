import { HelperComponent } from '@/types';

export const HelperElement: HelperComponent = {
  name: 'HelperElement',
  functional: true,
  render(h, { props }) {
    const field = props.field;
    const descriptor = props.descriptor;

    if (descriptor.helper) {
      const tag = field.isRoot ? 'p' : 'span';
      const data = {
        attrs: {
          ...descriptor.helperAttrs,
          'data-fs-helper': true
        }
      };

      return h(tag, data, descriptor.helper);
    }

    return null as any; // render nothing
  }
};
