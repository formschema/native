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
    this.attrs.value = this.field.input.initialValue as any;

    Object.defineProperty(this.attrs, 'checked', {
      enumerable: true,
      get: () => this.model === true
    });

    this.commit();
  }

  parseValue(checked: boolean) {
    return typeof checked === 'boolean' ? checked : undefined;
  }
}

Parser.register('boolean', BooleanParser);
