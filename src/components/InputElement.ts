import { VNode } from 'vue';
import { CreateInput } from '@/lib/CreateInput';
import { FieldElement } from '@/components/FieldElement';
import { InputComponent, InputField } from '@/types';

export const InputElement: InputComponent = {
  name: 'InputElement',
  functional: true,
  render(h, { data, children }): VNode | VNode[] {
    return h(FieldElement, data, [
      CreateInput<InputField>(h, 'input', data),
      ...(children || [])
    ]);
  }
};
