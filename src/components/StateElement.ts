import { FieldElement } from '@/components/FieldElement';
import { StateComponent, InputEvent } from '@/types';

export const StateElement: StateComponent = {
  name: 'StateElement',
  functional: true,
  render(h, { data, props }) {
    const attrs = props.field.input.attrs;
    const on = {
      change({ target }: InputEvent) {
        props.field.input.setValue(target.checked);
      }
    };

    return h(FieldElement, data, [
      h('input', { attrs, on })
    ]);
  }
};
