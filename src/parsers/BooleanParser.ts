import { Parser } from '@/parsers/Parser';
import { BooleanField, ScalarDescriptor } from '@/types';

export class BooleanParser extends Parser<unknown, ScalarDescriptor, BooleanField> {
  public parse(): void {
    super.parse();

    this.field.attrs.input.type = 'checkbox';
    this.field.attrs.input.checked = this.model === true;

    this.emit();
  }

  protected parseValue(checked: boolean): boolean | undefined {
    return typeof checked !== 'boolean' ? undefined : checked || false;
  }

  protected setValue(checked: boolean) {
    super.setValue(checked);

    this.field.attrs.input.checked = this.model === true;
  }
}

Parser.register('boolean', BooleanParser);
