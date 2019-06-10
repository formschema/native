import { AbstractParser } from '@/parsers/AbstractParser';
import { ListField, ListItem, ScalarDescriptor, FieldKind } from '@/types';

export class ListParser extends AbstractParser<any, ScalarDescriptor, ListField> {
  readonly enums: any[] = [];

  get kind(): FieldKind {
    return 'list';
  }

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, 'list').component;
  }

  get items(): ListItem[] {
    return this.enums.map((item) => ({
      value: item,
      selected: this.model === item,
      label: this.descriptor.labels
        ? this.descriptor.labels[item] || item
        : item
    }));
  }

  parse() {
    if (this.schema.enum instanceof Array) {
      this.enums.push(...this.schema.enum);
    }

    this.field.items = this.items;

    this.parseField();
  }

  parseValue(data: any): string {
    return typeof data !== 'undefined' ? data : '';
  }
}
