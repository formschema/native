import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, BooleanField, CheckboxAttributes } from '@/types';

export class BooleanParser extends Parser<boolean, BooleanField, ScalarDescriptor, CheckboxAttributes> {
  get type() {
    return 'checkbox';
  }

  isEmpty(data: unknown = this.model) {
    return data !== true;
  }

  parse(): void {
    this.attrs.checked = this.model === true;

    this.commit();
  }

  parseValue(checked: boolean) {
    return typeof checked !== 'boolean' ? undefined : checked || false;
  }
}

Parser.register('boolean', BooleanParser);
