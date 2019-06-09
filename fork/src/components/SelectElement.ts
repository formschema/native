import { FunctionalComponentOptions } from 'vue';
import { CreateInput } from '@/lib/NativeElementsLib';
import { HelperElement } from "@/components/HelperElement";
import { FieldElement } from "@/components/FieldElement";

export const SelectElement: FunctionalComponentOptions = {
  name: 'SelectElement',
  functional: true,
  render(h, { data, props }) {
    const nodes = [];
    const children = props.field.items.map(({ value, label }) => {
      return h('option', {
        attrs: { value }
      }, label)
    });

    nodes.push(CreateInput(h, 'select', data, children));
    nodes.push(h(HelperElement, data));

    return h(FieldElement, data, nodes);
  }
};
