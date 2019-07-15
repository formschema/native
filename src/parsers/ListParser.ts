import { Parser } from '@/parsers/Parser';
import { ListField, ListItem, ScalarDescriptor, FieldKind } from '@/types';

export class ListParser extends Parser<unknown, ListField, ScalarDescriptor> {
  get kind(): FieldKind {
    return 'list';
  }

  get defaultComponent() {
    const kind = this.descriptor.kind ? this.descriptor.kind : this.kind;
    const descriptor = this.options.descriptorConstructor<ScalarDescriptor>(this.schema, kind);

    return descriptor.component;
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

    this.commit();
  }
}

Parser.register('list', ListParser);
