import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, NullField, NullAttributes } from '@/types';

export class NullParser extends Parser<null, NullField, ScalarDescriptor, NullAttributes> {
  get type() {
    return 'hidden';
  }

  parse() {
    this.attrs.value = '\u0000';

    this.commit();
  }

  parseValue(): null {
    return null;
  }
}

Parser.register('null', NullParser);
