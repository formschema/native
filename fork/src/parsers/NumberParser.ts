import { AbstractParser } from '@/parsers/AbstractParser';
import { NumberField, ScalarDescriptor } from '@/types';

export class NumberParser extends AbstractParser<number, ScalarDescriptor, NumberField> {
  parse() {
    this.field.kind = 'number';
    this.field.attrs.input.type = 'number';
    this.field.attrs.input.min = this.schema.minimum;
    this.field.attrs.input.max = this.schema.maximum;

    this.parseField();
    this.parseInputValue();

    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as any;

      this.field.attrs.input.min = Number.parseFloat(exclusiveMinimum) + 0.1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as any;

      this.field.attrs.input.max = Number.parseFloat(exclusiveMaximum) - 0.1;
    }
  }

  parseValue(data: any): number {
    return data !== undefined ? Number(data) : data;
  }
}
