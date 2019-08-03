import { Parser } from '@/parsers/Parser';
import { FieldKind, Dictionary, ScalarDescriptor, StringField, StringAttributes } from '@/types';
import { Pattern } from '@/lib/Pattern';
import { Value } from '@/lib/Value';

const TypeFormat: Dictionary<string> = {
  date: 'date',
  'date-time': 'datetime-local',
  email: 'email',
  'idn-email': 'email',
  time: 'time',
  uri: 'url'
};

export class StringParser extends Parser<string, StringField, ScalarDescriptor, StringAttributes> {
  get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'string';
  }

  get type(): string {
    if (this.isEnumItem) {
      return 'radio';
    }

    return this.schema.format
      ? TypeFormat[this.schema.format]
      : 'text';
  }

  isEmpty(data: unknown = this.model) {
    return typeof data === 'string' ? data.length === 0 : true;
  }

  parse() {
    Object.defineProperty(this.attrs, 'value', {
      enumerable: true,
      configurable: true,
      get: () => this.model
    });

    this.attrs.minlength = this.schema.minLength;
    this.attrs.maxlength = this.schema.maxLength;

    if (this.schema.pattern) {
      this.attrs.pattern = this.schema.pattern;
    } else if (this.schema.hasOwnProperty('const')) {
      this.attrs.pattern = Pattern.escape(`${this.schema.const}`);
    }

    this.commit();
  }

  parseValue(data: unknown) {
    return Value.string(data);
  }
}

Parser.register('string', StringParser);
