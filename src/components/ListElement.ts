import { CreateInput } from '@/lib/CreateInput';
import { FieldElement } from '@/components/FieldElement';
import { ListComponent } from '@/types';

export const ListElement: ListComponent = {
  name: 'ListElement',
  functional: true,
  render(h, { data, props }) {
    const descriptor = props.field.descriptor;
    const children = descriptor.options.map(({ label, value, selected }) => {
      return h('option', { attrs: { value, selected } }, label);
    });

    return h(FieldElement, data, [
      CreateInput(h, 'select', data, children, 'change')
    ]);
  }
};
