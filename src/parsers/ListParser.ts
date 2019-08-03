import { Parser } from '@/parsers/Parser';
import { ListField, ListItem, ScalarDescriptor, FieldKind } from '@/types';
import { Value } from '@/lib/Value';

export class ListParser extends Parser<unknown, ListField, ScalarDescriptor> {
  get kind(): FieldKind {
    return 'list';
  }

  get defaultComponent() {
    const kind = this.descriptor.kind ? this.descriptor.kind : this.kind;
    const descriptor = this.options.descriptorConstructor.get(this.schema, kind);

    return descriptor.component;
  }

  get items(): ListItem[] {
    if (this.schema.enum instanceof Array) {
      const items = this.descriptor.items || {};

      return this.schema.enum
        .map((item: any) => {
          switch (this.schema.type) {
            case 'boolean':
              return item === true ? 'true' : 'false';

            case 'null':
              return 'null';

            default:
              return item;
          }
        })
        .map((item: any) => ({
          value: item,
          selected: this.model === item,
          label: items[item] ? items[item].label : item
        }));
    }

    return [];
  }

  parseValue(data: unknown): unknown {
    const type = this.schema.type;

    if (Value.hasOwnProperty(type)) {
      if (type === 'boolean' && typeof data === 'string') {
        data = data === 'true';
      }

      return (Value as any)[type](data);
    }

    return data as any;
  }

  parse() {
    this.field.items = this.items;

    this.commit();
  }
}

Parser.register('list', ListParser);
