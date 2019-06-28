import { AbstractParser } from '@/parsers/AbstractParser';
import { BooleanField, ScalarDescriptor } from '@/types';

export class BooleanParser extends AbstractParser<boolean, ScalarDescriptor, BooleanField> {
  public parse(): void {
    super.parse();

    this.field.attrs.input.type = 'checkbox';
    this.field.attrs.input.checked = this.field.model === true;
  }

  protected parseValue(checked: boolean): boolean {
    return checked || false;
  }
}
