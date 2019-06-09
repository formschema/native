import { AbstractParser } from '@/parsers/AbstractParser';
import { ListField, ListItem, ScalarDescriptor } from '@/types';

export class ListParser extends AbstractParser<any, ScalarDescriptor, ListField> {
  readonly enums: any[] = [];

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, 'list').component;
  }

  get items(): ListItem[] {
    return this.enums.map((item, i) => ({
      index: i,
      value: item,
      label: this.descriptor.labels
        ? this.descriptor.labels[item] || item
        : item
    }));
  }

  parse() {
    if (this.schema.enum instanceof Array) {
      this.enums.push(...this.schema.enum);
    }

    this.field.kind = 'list';
    this.field.items = this.items;

    this.parseField();
  }

  parseValue(data: any): string {
    return typeof data !== 'undefined' ? data : '';
  }
}
