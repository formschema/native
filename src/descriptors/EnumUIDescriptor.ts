import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { EnumField, RadioField, IEnumItemDescriptor, EnumDescriptor, IEnumDescriptor } from '@/types';
import { ItemUIDescriptor } from './ItemUIDescriptor';

export class EnumUIDescriptor extends ItemUIDescriptor<EnumField, RadioField, EnumDescriptor> implements IEnumDescriptor {
  get children(): IEnumItemDescriptor[] {
    return this.field.children.map((field) => this.getDescriptor(field));
  }

  getDescriptor(field: RadioField): IEnumItemDescriptor {
    const options = this.items[field.value] || {};

    if (!options.kind) {
      options.kind = field.schema.type;
    }

    return UIDescriptor.get(options, field, this.components) as IEnumItemDescriptor
      || UIDescriptor.get({ kind: 'string' }, field, this.components) as IEnumItemDescriptor;
  }
}

UIDescriptor.register('enum', EnumUIDescriptor);
