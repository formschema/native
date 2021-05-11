import { Parser } from '@/parsers/Parser';
import { NumberParser } from '@/parsers/NumberParser';
import { Value } from '@/lib/Value';

export class IntegerParser extends NumberParser {
  parseExclusiveKeywords(): void {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as number;

      this.field.attrs.min = exclusiveMinimum + 1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as number;

      this.field.attrs.max = exclusiveMaximum - 1;
    }
  }

  parseValue(data: unknown): number | undefined {
    return Value.integer(data);
  }
}

Parser.register('integer', IntegerParser);
