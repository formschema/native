import { AbstractParser } from '@/parsers/AbstractParser';
import { BooleanField, ScalarDescriptor } from '@/types';

export class BooleanParser extends AbstractParser<unknown, ScalarDescriptor, BooleanField> {
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
