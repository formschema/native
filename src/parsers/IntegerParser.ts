import { NumberParser } from '@/parsers/NumberParser';
import { FieldKind } from '@/types';

export class IntegerParser extends NumberParser {
  public get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'integer';
  }

  protected parseExclusiveKeywords() {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as number;

      this.field.attrs.input.min = exclusiveMinimum + 1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as number;

      this.field.attrs.input.max = exclusiveMaximum - 1;
    }
  }

  protected parseValue(data: number): number {
    const value = typeof data !== 'undefined' ? Number(data) : data;

    return Number.isNaN(value) ? undefined as any : Number.parseInt(`${value}`, 10);
  }
}
