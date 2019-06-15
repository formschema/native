import { AbstractParser } from '@/parsers/AbstractParser';
import { NumberField, ScalarDescriptor, FieldKind } from '@/types';

export class NumberParser extends AbstractParser<number, ScalarDescriptor, NumberField> {
  public get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'number';
  }

  public get type() {
    return this.isEnumItem ? 'radio' : 'number';
  }

  protected parseExclusiveKeywords() {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as number;

      this.field.attrs.input.min = exclusiveMinimum + 0.1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as number;

      this.field.attrs.input.max = exclusiveMaximum - 0.1;
    }
  }

  public parse() {
    super.parse();

    this.field.attrs.input.min = this.schema.minimum;
    this.field.attrs.input.max = this.schema.maximum;

    if (!Number.isNaN(this.field.model) && typeof this.field.model !== 'undefined') {
      this.field.attrs.input.value = `${this.field.model}`;
    }

    if (this.schema.hasOwnProperty('multipleOf')) {
      this.field.attrs.input.step = this.schema.multipleOf;
    }

    this.parseExclusiveKeywords();
  }

  protected parseValue(data: number): number {
    const value = typeof data !== 'undefined' ? Number(data) : data;

    return Number.isNaN(value) ? undefined as any : Number.parseFloat(`${value}`);
  }
}
