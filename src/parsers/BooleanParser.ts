import { Parser } from '@/parsers/Parser';
import { ScalarParser } from '@/parsers/ScalarParser';
import { BooleanField, ParserOptions, UnknowParser, ScalarDescriptor } from '@/types';
import { Value } from '@/lib/Value';

export class BooleanParser extends ScalarParser<boolean, BooleanField> {
  constructor(options: ParserOptions<boolean, BooleanField, ScalarDescriptor>, parent?: UnknowParser) {
    const schema = options.schema;
    const kind = options.kind || ScalarParser.getKind(schema, parent) || 'boolean';
    const type = ScalarParser.getType(kind) || 'checkbox';

    super(kind, type, options, parent);
  }

  isEmpty(data: unknown = this.model) {
    return typeof data !== 'boolean';
  }

  parse() {
    if (this.field.attrs.type !== 'radio') {
      Object.defineProperty(this.field.attrs, 'checked', {
        enumerable: true,
        get: () => !!this.model
      });
    }

    this.field.toggle = () => {
      this.field.setValue(!this.model);
    };

    this.commit();
  }

  parseValue(checked: boolean) {
    return Value.boolean(checked);
  }
}

Parser.register('boolean', BooleanParser);
