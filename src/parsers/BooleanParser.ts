import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, CheckboxAttributes } from '@/types';

export class BooleanParser extends Parser<'boolean', boolean, CheckboxAttributes, ScalarDescriptor> {
  get type() {
    return 'checkbox';
  }

  parse(): void {
    super.parse();

    this.attrs.checked = this.model === true;

    this.commit();
  }

  parseValue(checked: boolean): boolean | undefined {
    return typeof checked !== 'boolean' ? undefined : checked || false;
  }
}

Parser.register('boolean', BooleanParser);
