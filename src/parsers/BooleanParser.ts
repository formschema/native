import { Parser } from '@/parsers/Parser';
import { BooleanField, ScalarDescriptor } from '@/types';

export class BooleanParser extends Parser<boolean, ScalarDescriptor, BooleanField> {
  public parse(): void {
    super.parse();

    this.field.attrs.input.type = 'checkbox';
    this.field.attrs.input.checked = this.model === true;

    this.commit();
  }

  protected parseValue(checked: boolean): boolean | undefined {
    return typeof checked !== 'boolean' ? undefined : checked || false;
  }
}

Parser.register('boolean', BooleanParser);
