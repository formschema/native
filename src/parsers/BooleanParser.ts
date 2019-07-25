import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, BooleanField, CheckboxAttributes } from '@/types';

export class BooleanParser extends Parser<boolean, BooleanField, ScalarDescriptor, CheckboxAttributes> {
  get type() {
    return 'checkbox';
  }

  isEmpty(data: unknown = this.model) {
    return data !== true;
  }

  resetChecked() {
    this.attrs.checked = this.model === true;
  }

  reset() {
    super.reset();
    this.resetChecked();
  }

  clear() {
    super.clear();

    this.attrs.checked = false;
  }

  parse(): void {
    this.attrs.value = this.field.input.initialValue as any;

    this.resetChecked();
    this.commit();
  }

  parseValue(checked: boolean) {
    return typeof checked === 'boolean' ? checked : undefined;
  }
}

Parser.register('boolean', BooleanParser);
