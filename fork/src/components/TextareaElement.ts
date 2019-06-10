import { FunctionalComponentOptions } from 'vue';
import { CreateInput } from '@/lib/NativeElementsLib';
import { FieldElement } from "@/components/FieldElement";

export const TextareaElement: FunctionalComponentOptions = {
  name: 'TextareaElement',
  functional: true,
  render(h, { data, props }) {
    return h(FieldElement, data, [
      CreateInput(h, 'textarea', data, props.field.model)
    ]);
  }
};
