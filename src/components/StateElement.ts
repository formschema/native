import { FieldElement } from '@/components/FieldElement';
import { StateComponent, InputEvent } from '@/types';

export const StateElement: StateComponent = {
  name: 'StateElement',
  functional: true,
  render(h, { data, props }) {
    const on = {
      change({ target }: InputEvent) {
        props.field.setValue(target.checked);
      }
    };

    return h(FieldElement, data, [
      h('input', { ...data, on })
    ]);
  }
};
