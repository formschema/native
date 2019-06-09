import { FunctionalComponentOptions } from 'vue';
import { CreateInput } from '@/lib/NativeElementsLib';
import { FieldElement } from "@/components/FieldElement";

export const TextareaElement: FunctionalComponentOptions = {
  name: 'TextareaElement',
  functional: true,
  render(h, { data, props }) {
    const nodes = [
      CreateInput(h, 'textarea', data, props.field.model)
    ];

    return h(FieldElement, data, nodes);
  }
};
