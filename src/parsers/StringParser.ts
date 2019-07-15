import { Parser } from '@/parsers/Parser';
import { FieldKind, Dictionary, ScalarDescriptor, StringAttributes } from '@/types';
import { Pattern } from '@/lib/Pattern';

const TypeFormat: Dictionary<string> = {
  date: 'date',
  'date-time': 'datetime-local',
  email: 'email',
  'idn-email': 'email',
  time: 'time',
  uri: 'url'
};

export class StringParser extends Parser<'string', string, StringAttributes, ScalarDescriptor> {
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

  parse() {
    super.parse();

    this.attrs.value = this.field.input.value;
    this.attrs.minlength = this.schema.minLength;
    this.attrs.maxlength = this.schema.maxLength;

    if (this.schema.pattern) {
      this.attrs.pattern = this.schema.pattern;
    } else if (this.schema.hasOwnProperty('const')) {
      this.attrs.pattern = Pattern.escape(`${this.schema.const}`);
    }

    this.commit();
  }

  parseValue(data: unknown): string | undefined {
    return typeof data !== 'undefined' ? `${data}` : undefined;
  }
}

Parser.register('string', StringParser);
