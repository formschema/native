import { Parser } from '@/parsers/Parser';
import { BooleanField, ScalarDescriptor } from '@/types';

export class BooleanParser extends Parser<boolean, ScalarDescriptor, BooleanField> implements BooleanParser {
  get type() {
    return 'checkbox';
  }

  parse(): void {
    super.parse();

    this.field.attrs.input.checked = this.model === true;

    this.commit();
  }

  parseValue(checked: boolean): boolean | undefined {
    return typeof checked !== 'boolean' ? undefined : checked || false;
  }
}

Parser.register('boolean', BooleanParser);
