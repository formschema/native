import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, FieldKind, NumberField, NumberAttributes } from '@/types';
import { Value } from '@/lib/Value';

export class NumberParser extends Parser<number, NumberField, ScalarDescriptor, NumberAttributes> {
  get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'number';
  }

  get type() {
    return this.isEnumItem ? 'radio' : 'number';
  }

  parseExclusiveKeywords() {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as number;

      this.attrs.min = exclusiveMinimum + 0.1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as number;

      this.attrs.max = exclusiveMaximum - 0.1;
    }
  }

  parse() {
    Object.defineProperty(this.attrs, 'value', {
      enumerable: true,
      get: () => (this.isEmpty(this.model) ? undefined : `${this.model}`)
    });

    this.attrs.min = this.schema.minimum;
    this.attrs.max = this.schema.maximum;
    this.attrs.step = this.schema.multipleOf;

    this.parseExclusiveKeywords();
    this.commit();
  }

  parseValue(data: unknown) {
    return Value.number(data);
  }
}

Parser.register('number', NumberParser);
