import { HelperComponent } from '@/types';

export const HelperElement: HelperComponent = {
  name: 'HelperElement',
  functional: true,
  render(h, { props }) {
    const field = props.field;

    if (field.helper.value) {
      const tag = field.isRoot ? 'p' : 'span';
      const data = {
        attrs: field.helper.attrs
      };

      return h(tag, data, field.helper.value);
    }

    return null as any; // render nothing
  }
};
