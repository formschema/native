import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { EnumField, RadioField, IEnumItemDescriptor, EnumDescriptor, ScalarKind } from '@/types';
import { ItemUIDescriptor } from './ItemUIDescriptor';
import { Components } from '@/lib/Components';

export class EnumUIDescriptor extends ItemUIDescriptor<EnumField, RadioField, EnumDescriptor> {
  readonly children: IEnumItemDescriptor[] = [];

  constructor(options: EnumDescriptor, field: Readonly<EnumField>, components: Components) {
    super(options, field, components);
  }

  getChildren(field: Readonly<EnumField>): IEnumItemDescriptor[] {
    const items = [];

    for (const key in field.children) {
      const childField = field.children[key];
      const descriptor = this.getChildDescriptor(childField);

      items.push(descriptor);
    }

    return items;
  }

  getChildDescriptor(field: Readonly<RadioField>): IEnumItemDescriptor {
    const options = this.items[`${field.value}`] || {};

    if (!options.kind) {
      options.kind = field.schema.type as ScalarKind;
    }

    return UIDescriptor.get(options, field, this.components) as IEnumItemDescriptor
      || UIDescriptor.get({ kind: 'string' }, field, this.components) as IEnumItemDescriptor;
  }

  parse(field: EnumField) {
    super.parse(field);

    this.children.push(...this.getChildren(field));
  }
}

UIDescriptor.register('enum', EnumUIDescriptor);
