import { AbstractParser } from '@/parsers/AbstractParser';
import { NullField, ScalarDescriptor } from '@/types';

export class NullParser extends AbstractParser<null, ScalarDescriptor, NullField> {
  parse() {
    this.field.attrs.input.type = 'hidden';
    this.field.attrs.input.value = '\u0000';

    this.parseField();
  }

  parseValue(data: any): null {
    return null;
  }
}
