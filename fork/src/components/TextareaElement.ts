import { CreateInput } from '@/lib/CreateInput';
import { FieldElement } from "@/components/FieldElement";
import { TextareaComponent, InputField } from '@/types';

export const TextareaElement: TextareaComponent = {
  name: 'TextareaElement',
  functional: true,
  render(h, { data, props }) {
    return h(FieldElement, data, [
      CreateInput<InputField>(h, 'textarea', data, props.field.model)
    ]);
  }
};
