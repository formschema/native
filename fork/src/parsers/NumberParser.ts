import { AbstractParser } from '@/parsers/AbstractParser';
import { NumberField, ScalarDescriptor, FieldKind } from '@/types';

export class NumberParser extends AbstractParser<number, ScalarDescriptor, NumberField> {
  get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'number';
  }

  get type() {
    return this.isEnumItem ? 'radio' : 'number';
  }

  parse() {
    this.parseField();
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

    if (!Number.isNaN(this.field.model) && this.field.model !== void(0)) {
      this.field.attrs.input.value = `${this.field.model}`;
    }

    if (this.schema.hasOwnProperty('multipleOf')) {
      this.field.attrs.input.step = this.schema.multipleOf;
    }

    this.parseExclusiveKeywords();
  }

  parseValue(data: any): number {
    const value = data !== void(0) ? Number(data) : data;

    return Number.isNaN(value) ? void(0) as any : Number.parseFloat(value);
  }
}
