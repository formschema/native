import { NumberParser } from '@/parsers/NumberParser';
import { FieldKind } from '@/types';

export class IntegerParser extends NumberParser {
  get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'integer';
  }

  parseExclusiveKeywords() {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as any;

      this.field.attrs.input.min = Number.parseInt(exclusiveMinimum, 10) + 1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as any;

      this.field.attrs.input.max = Number.parseInt(exclusiveMaximum, 10) - 1;
    }
  }

  parseValue(data: any): number {
    const value = data !== void(0) ? Number(data) : data;

    return Number.isNaN(value) ? void(0) as any : Number.parseInt(value, 10);
  }
}
