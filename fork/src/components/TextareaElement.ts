import { CreateInput } from '@/lib/NativeElementsLib';
import { FieldElement } from "@/components/FieldElement";
import { TextareaComponent } from '@/types';

export const TextareaElement: TextareaComponent = {
  name: 'TextareaElement',
  functional: true,
  render(h, { data, props }) {
    return h(FieldElement, data, [
      CreateInput(h, 'textarea', data, props.field.model)
    ]);
  }
};
