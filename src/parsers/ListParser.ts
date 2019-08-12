import { Parser } from '@/parsers/Parser';
import { ListField, ListItemModel, ListDescriptor, ParserOptions, UnknowParser } from '@/types';

export class ListParser extends Parser<unknown, ListField, ListDescriptor> {
  constructor(options: ParserOptions<unknown>, parent?: UnknowParser) {
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

  parseItem(item: unknown) {
    switch (this.schema.type) {
      case 'boolean':
        return item === true ? 'true' : 'false';

      case 'null':
        return 'null';

      default:
        return item;
    }
  }

  parse() {
    this.field.items = this.items;

    this.commit();
  }
}

Parser.register('list', ListParser);
