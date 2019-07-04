import { FieldElement } from '@/components/FieldElement';
import { CheckboxComponent, InputEvent } from '@/types';

export const CheckboxElement: CheckboxComponent = {
  name: 'CheckboxElement',
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
