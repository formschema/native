import { Parser } from '@/parsers/Parser';
import { ScalarParser } from '@/parsers/ScalarParser';
import { NullField, NullAttributes, UnknowParser, ParserOptions } from '@/types';

export class NullParser extends ScalarParser<null, NullField, NullAttributes> {
  constructor(options: ParserOptions<null>, parent?: UnknowParser) {
    const schema = options.schema;
    const kind = ScalarParser.getKind(schema, parent) || 'hidden';
    const type = ScalarParser.getType(kind) || 'hidden';

    super(kind, type, options, parent);
  }

  parse() {
    this.attrs.value = '\u0000';

    this.commit();
  }

  parseValue() {
    return null;
  }
}

Parser.register('null', NullParser);
