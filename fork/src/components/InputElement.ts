import { FunctionalComponentOptions } from 'vue';
import { CreateInput } from '@/lib/NativeElementsLib';
import { FieldElement } from "@/components/FieldElement";

export const InputElement: FunctionalComponentOptions = {
  name: 'InputElement',
  functional: true,
  render(h, { data }) {
    return h(FieldElement, data, [
      CreateInput(h, 'input', data, [])
    ]);
  }
};
