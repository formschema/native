import { CreateInput } from '@/lib/CreateInput';
import { FieldElement } from '@/components/FieldElement';
import { TextareaComponent, InputField } from '@/types';

export const TextareaElement: TextareaComponent = {
  name: 'TextareaElement',
  functional: true,
  render(h, { data, props }) {
    // attributes `type` and `value` are not applicable to a textarea input
    delete props.field.attrs.input.type;
    delete props.field.attrs.input.value;

    return h(FieldElement, data, [
      CreateInput<InputField>(h, 'textarea', data, props.field.value)
    ]);
  }
};
