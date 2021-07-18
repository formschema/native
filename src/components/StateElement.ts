import { VNode } from 'vue';
import { FieldElement } from '@/components/FieldElement';
import { StateComponent, InputEvent } from '../../types';

export const StateElement: StateComponent = {
  name: 'StateElement',
  functional: true,
  render(h, { data, props: { field }, children = [] }): VNode | VNode[] {
    return h(FieldElement, data, [
      h('input', {
        key: field.key,
        attrs: field.descriptor.attrs,
        on: {
          change: ({ target }: InputEvent) => field.setValue(target.checked)
        }
      }),
      ...children
    ]);
  }
};
