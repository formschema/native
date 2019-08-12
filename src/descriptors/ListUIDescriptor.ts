import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { ListDescriptor, ListField, ListFieldItemDescriptor, UnknowField, IListDescriptor } from '@/types';
import { ItemUIDescriptor } from './ItemUIDescriptor';

export class ListUIDescriptor extends ItemUIDescriptor<ListField, UnknowField, ListDescriptor> implements IListDescriptor {
  getLabel(value: unknown) {
    const item = this.items[value as any];

    return item ? item.label : value as any;
  }

  get options(): ListFieldItemDescriptor[] {
    return [
      {
        label: this.props.placeholder as any,
        value: '',
        selected: false
      },
      ...this.field.items.map((item) => ({
        ...item,
        label: this.getLabel(item.value)
      }))
    ];
  }
}

UIDescriptor.register('list', ListUIDescriptor);
