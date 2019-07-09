import { Parser } from '@/parsers/Parser';
import { NumberField, ScalarDescriptor, FieldKind, INumberParser } from '@/types';

export class NumberParser extends Parser<number, ScalarDescriptor, NumberField> implements INumberParser {
  get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'number';
  }

  get type() {
    return this.isEnumItem ? 'radio' : 'number';
  }

  parseExclusiveKeywords() {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as number;

      this.field.attrs.input.min = exclusiveMinimum + 0.1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as number;

      this.field.attrs.input.max = exclusiveMaximum - 0.1;
    }
  }

  parse() {
    super.parse();

    this.field.attrs.input.min = this.schema.minimum;
    this.field.attrs.input.max = this.schema.maximum;
    this.field.attrs.input.step = this.schema.multipleOf;

    if (typeof this.field.value !== 'undefined') {
      this.field.attrs.input.value = `${this.field.value}`;
    }

    this.parseExclusiveKeywords();
    this.commit();
  }

  parseValue(data: unknown): number | undefined {
    const value = Number(data);

    return Number.isNaN(value) ? undefined : Number.parseFloat(`${data}`);
  }
}

Parser.register('number', NumberParser);
