import { CreateInput } from '@/lib/CreateInput';
import { FieldElement } from '@/components/FieldElement';
import { ListComponent } from '@/types';

export const ListElement: ListComponent = {
  name: 'ListElement',
  functional: true,
  render(h, { data, props }) {
    const items = [ ...props.field.items ];

    items.unshift({
      label: props.field.input.props.placeholder,
      value: '',
      selected: false
    });

    const children = items.map(({ label, value, selected }) => {
      return h('option', { attrs: { value, selected } }, label);
    });

    return h(FieldElement, data, [
      CreateInput(h, 'select', data, children, 'change')
    ]);
  }
};
