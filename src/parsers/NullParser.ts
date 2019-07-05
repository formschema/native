import { Parser } from '@/parsers/Parser';
import { NullField, ScalarDescriptor } from '@/types';

export class NullParser extends Parser<null, ScalarDescriptor, NullField> {
  public parse() {
    this.field.attrs.input.type = 'hidden';
    this.field.attrs.input.value = '\u0000';

    super.parse();
    this.commit();
  }

  protected parseValue(): null {
    return null;
  }
}

Parser.register('null', NullParser);
