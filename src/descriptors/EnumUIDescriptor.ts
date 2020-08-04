import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { Components } from '@/lib/Components';
import { EnumField, RadioField, IEnumItemDescriptor, EnumDescriptor, Component, ScalarKind } from '@/types';
import { ItemUIDescriptor } from './ItemUIDescriptor';

const DEFAULT_KIND: ScalarKind = 'radio';

export class EnumUIDescriptor extends ItemUIDescriptor<EnumField, RadioField, EnumDescriptor> {
  readonly layout: Component;
  readonly children: IEnumItemDescriptor[] = [];

  constructor(options: EnumDescriptor, field: Readonly<EnumField>, components: Components) {
    super(options, field, components);

    this.layout = options.layout || 'fieldset';
  }

  getChildren(field: Readonly<EnumField>): IEnumItemDescriptor[] {
    return field.children.map((childField) => this.getChildDescriptor(childField));
  }

  getChildDescriptor(field: Readonly<RadioField>): IEnumItemDescriptor {
    const options = this.items[`${field.value}`] || {};

    if (!options.kind) {
      options.kind = DEFAULT_KIND;
    }

    return UIDescriptor.get(options, field, this.components) as IEnumItemDescriptor
      || UIDescriptor.get({ kind: DEFAULT_KIND }, field, this.components) as IEnumItemDescriptor;
  }

  parse(field: EnumField): void {
    super.parse(field);
    this.children.push(...this.getChildren(field));
  }
}

UIDescriptor.register('enum', EnumUIDescriptor);
