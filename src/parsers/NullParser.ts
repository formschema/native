import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, NullAttributes } from '@/types';

export class NullParser extends Parser<'null', null, NullAttributes, ScalarDescriptor> {
  get type() {
    return 'hidden';
  }

  parse() {
    this.attrs.value = '\u0000';

    super.parse();
    this.commit();
  }

  parseValue(): null {
    return null;
  }
}

Parser.register('null', NullParser);
