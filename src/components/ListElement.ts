import { CreateInput } from '@/lib/CreateInput';
import { HelperElement } from "@/components/HelperElement";
import { FieldElement } from "@/components/FieldElement";
import { ListComponent } from '@/types';

export const ListElement: ListComponent = {
  name: 'ListElement',
  functional: true,
  render(h, { data, props }) {
    const children = props.field.items.map(({ label, value, selected }) => {
      const attrs = { value, selected };

      return h('option', { attrs }, label);
    });

    return h(FieldElement, data, [
      CreateInput(h, 'select', data, children),
      h(HelperElement, data)
    ]);
  }
};
