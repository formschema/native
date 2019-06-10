import { AbstractParser } from '@/parsers/AbstractParser';
import { BooleanField, ScalarDescriptor } from '@/types';

export class BooleanParser extends AbstractParser<boolean, ScalarDescriptor, BooleanField> {
  parse() {
    this.parseField();

    this.field.attrs.input.type = 'checkbox';
    this.field.attrs.input.checked = this.field.model === true;
  }

  parseValue(data: any): boolean {
    return data || false;
  }
}
