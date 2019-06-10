import { FunctionalComponentOptions } from 'vue';
import { CreateInput } from '@/lib/NativeElementsLib';
import { HelperElement } from "@/components/HelperElement";
import { FieldElement } from "@/components/FieldElement";

export const SelectElement: FunctionalComponentOptions = {
  name: 'SelectElement',
  functional: true,
  render(h, { data, props }) {
    const children = props.field.items.map(({ value, label }) => {
      const attrs = { value };

      return h('option', { attrs }, label);
    });

    return h(FieldElement, data, [
      CreateInput(h, 'select', data, children),
      h(HelperElement, data)
    ]);
  }
};
