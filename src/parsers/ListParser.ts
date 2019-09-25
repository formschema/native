import { Parser } from '@/parsers/Parser';
import { ListField, ListItemModel, ParserOptions, UnknowParser, ListDescriptor } from '@/types';
import { ListUIDescriptor } from '@/descriptors/ListUIDescriptor';

export class ListParser extends Parser<unknown, ListField, ListUIDescriptor> {
  constructor(options: ParserOptions<unknown, ListField, ListDescriptor>, parent?: UnknowParser) {
    super('list', options, parent);

    this.field.hasChildren = false;
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
