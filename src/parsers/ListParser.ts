import { Parser } from '@/parsers/Parser';
import { ListField, ListItem, ScalarDescriptor, FieldKind, IListParser } from '@/types';

export class ListParser extends Parser<unknown, ScalarDescriptor, ListField> implements IListParser {
  get kind(): FieldKind {
    return 'list';
  }

  get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, this.kind).component;
  }

  get items(): ListItem[] {
    if (this.schema.enum instanceof Array) {
      const items = this.descriptor.items || {};

      return this.schema.enum.map((item: any): ListItem => ({
        value: item,
        selected: this.model === item,
        label: items[item] ? items[item].label || item : item
      }));
    }

    return [];
  }

  parse() {
    this.field.items = this.items;

    super.parse();
    this.commit();
  }
}

Parser.register('list', ListParser);
