import { AbstractParser } from '@/parsers/AbstractParser';
import { NullField, ScalarDescriptor } from '@/types';

export class NullParser extends AbstractParser<null, ScalarDescriptor, NullField> {
  public parse() {
    this.field.attrs.input.type = 'hidden';
    this.field.attrs.input.value = '\u0000';

    super.parse();
    this.emit();
  }

  protected parseValue(): null {
    return null;
  }
}
