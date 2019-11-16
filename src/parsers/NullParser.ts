import { Parser } from '@/parsers/Parser';
import { ScalarParser } from '@/parsers/ScalarParser';
import { NullField, UnknowParser, ParserOptions, ScalarDescriptor } from '@/types';

export class NullParser extends ScalarParser<null, NullField> {
  constructor(options: ParserOptions<null, NullField, ScalarDescriptor>, parent?: UnknowParser) {
    const schema = options.schema;
    const kind = ScalarParser.getKind(schema, parent) || 'hidden';
    const type = ScalarParser.getType(kind) || 'hidden';

    super(kind, type, options, parent);
  }

  parseField() {
    super.parseField();

    this.field.attrs.value = '\u0000';
  }

  parseValue() {
    return null;
  }
}

Parser.register('null', NullParser);
