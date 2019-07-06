import { Parser } from '@/parsers/Parser';
import { NullField, ScalarDescriptor, INullParser } from '@/types';

export class NullParser extends Parser<null, ScalarDescriptor, NullField> implements INullParser {
  get type() {
    return 'hidden';
  }

  parse() {
    this.field.attrs.input.value = '\u0000';

    super.parse();
    this.commit();
  }

  parseValue(): null {
    return null;
  }
}

Parser.register('null', NullParser);
