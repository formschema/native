import { NumberParser } from '@/parsers/NumberParser';

export class IntegerParser extends NumberParser {
  parse() {
    this.parseField();
    this.parseInputValue();

    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as any;

      this.field.attrs.input.min = Number.parseInt(exclusiveMinimum, 10) + 1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as any;

      this.field.attrs.input.max = Number.parseInt(exclusiveMaximum, 10) - 1;
    }
  }

  parseField() {
    super.parseField();

    this.field.kind = this.parent && this.parent.schema.enum ? 'radio' : 'integer';
  }
}
