import { AbstractParser } from '@/parsers/AbstractParser';
import { NumberField, ScalarDescriptor, FieldKind } from '@/types';

export class NumberParser extends AbstractParser<number, ScalarDescriptor, NumberField> {
  get kind(): FieldKind {
    return this.isEnum ? 'radio' : 'number';
  }

  get type() {
    return this.isEnum ? 'radio' : 'number';
  }

  parse() {
    this.parseField();
    this.parseInputValue();
  }

  parseExclusiveKeywords() {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as any;

      this.field.attrs.input.min = Number.parseFloat(exclusiveMinimum) + 0.1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as any;

      this.field.attrs.input.max = Number.parseFloat(exclusiveMaximum) - 0.1;
    }
  }

  parseField() {
    super.parseField();

    this.field.attrs.input.min = this.schema.minimum;
    this.field.attrs.input.max = this.schema.maximum;

    if (this.schema.hasOwnProperty('multipleOf')) {
      this.field.attrs.input.step = this.schema.multipleOf;
    }

    this.parseExclusiveKeywords();
  }

  parseValue(data: any): number {
    return data !== undefined ? Number(data) : data;
  }
}
