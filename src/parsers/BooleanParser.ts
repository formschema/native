import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, BooleanField, CheckboxAttributes } from '@/types';
import { Value } from '@/lib/Value';

export class BooleanParser extends Parser<boolean, BooleanField, ScalarDescriptor, CheckboxAttributes> {
  get type() {
    return 'checkbox';
  }

  isEmpty(data: unknown = this.model) {
    return data !== true;
  }

  parse(): void {
    Object.defineProperty(this.attrs, 'checked', {
      enumerable: true,
      get: () => this.model === true
    });

    this.commit();
  }

  parseValue(checked: boolean) {
    return Value.boolean(checked);
  }
}

Parser.register('boolean', BooleanParser);
