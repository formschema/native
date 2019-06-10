import { CreateInput } from '@/lib/NativeElementsLib';
import { FieldElement } from "@/components/FieldElement";
import { InputComponent } from '@/types';

export const InputElement: InputComponent = {
  name: 'InputElement',
  functional: true,
  render(h, { data }) {
    return h(FieldElement, data, [
      CreateInput(h, 'input', data, [])
    ]);
  }
};
