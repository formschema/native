import { FieldElement } from '@/components/FieldElement';
import { StateComponent, InputEvent } from '@/types';

export const StateElement: StateComponent = {
  name: 'StateElement',
  functional: true,
  render(h, { data, props: { field }, children = [] }) {
    return h(FieldElement, data, [
      h('input', {
        key: field.key,
        attrs: field.attrs,
        on: {
          change: ({ target }: InputEvent) => field.setValue(target.checked)
        }
      }),
      ...children
    ]);
  }
};
