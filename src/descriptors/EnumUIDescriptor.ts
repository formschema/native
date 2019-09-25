import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { EnumField, RadioField, IEnumItemDescriptor, EnumDescriptor, ScalarKind } from '@/types';
import { ItemUIDescriptor } from './ItemUIDescriptor';

export class EnumUIDescriptor extends ItemUIDescriptor<EnumField, RadioField, EnumDescriptor> {
  get children(): IEnumItemDescriptor[] {
    const items = [];

    for (const key in this.field.children) {
      const field = this.field.children[key];
      const descriptor = this.getDescriptor(field);

      items.push(descriptor);
    }

    return items;
  }

  getDescriptor(field: RadioField): IEnumItemDescriptor {
    const options = this.items[`${field.value}`] || {};

    if (!options.kind) {
      options.kind = field.schema.type as ScalarKind;
    }

    return UIDescriptor.get(options, field, this.components) as IEnumItemDescriptor
      || UIDescriptor.get({ kind: 'string' }, field, this.components) as IEnumItemDescriptor;
  }
}

UIDescriptor.register('enum', EnumUIDescriptor);
