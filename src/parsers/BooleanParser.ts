import { Parser } from '@/parsers/Parser';
import { ScalarParser } from '@/parsers/ScalarParser';
import { BooleanField, CheckboxAttributes, ParserOptions, UnknowParser } from '@/types';
import { Value } from '@/lib/Value';

export class BooleanParser extends ScalarParser<boolean, BooleanField, CheckboxAttributes> {
  constructor(options: ParserOptions<boolean>, parent?: UnknowParser) {
    const schema = options.schema;
    const kind = options.kind || ScalarParser.getKind(schema, parent) || 'boolean';
    const type = ScalarParser.getType(kind) || 'checkbox';

    super(kind, type, options, parent);
  }

  isEmpty(data: unknown = this.model) {
    return data !== true;
  }

  parse() {
    if (this.attrs.type !== 'radio') {
      Object.defineProperty(this.attrs, 'checked', {
        enumerable: true,
        get: () => !!this.model
      });
    }

    this.commit();
  }

  parseValue(checked: boolean) {
    return Value.boolean(checked);
  }
}

Parser.register('boolean', BooleanParser);
