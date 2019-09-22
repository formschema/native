import { Parser } from '@/parsers/Parser';
import { ScalarParser } from '@/parsers/ScalarParser';
import { NumberField, ParserOptions, UnknowParser, ScalarDescriptor } from '@/types';
import { Value } from '@/lib/Value';

export class NumberParser extends ScalarParser<number, NumberField> {
  constructor(options: ParserOptions<number, NumberField, ScalarDescriptor>, parent?: UnknowParser) {
    const schema = options.schema;
    const kind = options.kind || ScalarParser.getKind(schema, parent) || schema.type;
    const type = ScalarParser.getType(kind) || 'number';

    super(kind, type, options, parent);
  }

  parseExclusiveKeywords() {
    if (this.schema.hasOwnProperty('exclusiveMinimum')) {
      const exclusiveMinimum = this.schema.exclusiveMinimum as number;

      this.field.attrs.min = exclusiveMinimum + 0.1;
    }

    if (this.schema.hasOwnProperty('exclusiveMaximum')) {
      const exclusiveMaximum = this.schema.exclusiveMaximum as number;

      this.field.attrs.max = exclusiveMaximum - 0.1;
    }
  }

  parse() {
    Object.defineProperty(this.field.attrs, 'value', {
      enumerable: true,
      get: () => (this.isEmpty(this.model) ? undefined : `${this.model}`)
    });

    this.field.attrs.min = this.schema.minimum;
    this.field.attrs.max = this.schema.maximum;
    this.field.attrs.step = this.schema.multipleOf;

    this.parseExclusiveKeywords();
    this.commit();
  }

  parseValue(data: unknown) {
    return Value.number(data);
  }
}

Parser.register('number', NumberParser);
