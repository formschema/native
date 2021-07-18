import { Parser } from '@/parsers/Parser';
import { ListUIDescriptor } from '@/descriptors/ListUIDescriptor';
import { ListField, ListItemModel, ParserOptions, UnknowParser, ListDescriptor } from '../../types';

export class ListParser extends Parser<unknown, ListField, ListDescriptor, ListUIDescriptor> {
  constructor(options: ParserOptions<unknown, ListField, ListDescriptor>, parent?: UnknowParser) {
    super('list', options, parent);
  }

  get items(): ListItemModel[] {
    if (this.schema.enum instanceof Array) {
      return this.schema.enum
        .map((item: any) => this.parseItem(item))
        .map((item: any) => ({
          value: item,
          selected: this.model === this.parseValue(item)
        }));
    }

    return [];
  }

  parseItem(item: unknown): unknown {
    switch (this.schema.type) {
      case 'boolean':
        return item === true ? 'true' : 'false';

      case 'null':
        return 'null';

      default:
        return item;
    }
  }

  parseField(): void {
    this.field.hasChildren = false;
    this.field.items = this.items;
  }
}

Parser.register('list', ListParser);
