import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { ListDescriptor, ListField, ListFieldItemDescriptor, UnknowField, IListDescriptor } from '@/types';
import { ItemUIDescriptor } from './ItemUIDescriptor';

export class ListUIDescriptor extends ItemUIDescriptor<ListField, UnknowField, ListDescriptor> implements IListDescriptor {
  readonly options: ListFieldItemDescriptor[] = [];

  getLabel(value: unknown): string {
    const item = this.items[value as any];

    return item ? item.label : value as any;
  }

  getOptions(field: Readonly<ListField>): ListFieldItemDescriptor[] {
    return [
      {
        label: this.props.placeholder as any,
        value: '',
        selected: false
      },
      ...field.items.map((item) => ({
        ...item,
        label: this.getLabel(item.value)
      }))
    ];
  }

  parse(field: ListField): void {
    super.parse(field);

    this.options.push(...this.getOptions(field));
  }
}

UIDescriptor.register('list', ListUIDescriptor);
