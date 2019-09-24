import { Components } from '@/lib/Components';
import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { Dict, ScalarDescriptor, ItemsDescriptor, Field, ItemKind, IItemsUIDescriptor } from '@/types';

export abstract class ItemUIDescriptor<
  TField extends Field<any, any>,
  TChildField extends Field<any, any>,
  TDescriptor extends ItemsDescriptor<ItemKind>
> extends UIDescriptor<TField> implements IItemsUIDescriptor<TField, TChildField> {
  items: Dict<ScalarDescriptor>;

  constructor(options: TDescriptor, field: Readonly<TField>, components: Components) {
    super(options, field, components);

    this.items = options.items || {};
  }
}
