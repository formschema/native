import { Parser } from '@/parsers/Parser';
import { StringField, ScalarDescriptor, FieldKind, Dictionary, IStringParser } from '@/types';
import { Pattern } from '@/lib/Pattern';

const TypeFormat: Dictionary<string> = {
  date: 'date',
  'date-time': 'datetime-local',
  email: 'email',
  'idn-email': 'email',
  time: 'time',
  uri: 'url'
};

export class StringParser extends Parser<string, ScalarDescriptor, StringField> implements IStringParser {
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

    this.field.attrs.input.value = this.field.value;
    this.field.attrs.input.minlength = this.schema.minLength;
    this.field.attrs.input.maxlength = this.schema.maxLength;

    if (this.schema.pattern) {
      this.field.attrs.input.pattern = this.schema.pattern;
    } else if (this.schema.hasOwnProperty('const')) {
      this.field.attrs.input.pattern = Pattern.escape(`${this.schema.const}`);
    }

    this.commit();
  }

  parseValue(data: unknown): string | undefined {
    return typeof data !== 'undefined' ? `${data}` : undefined;
  }
}

Parser.register('string', StringParser);
