import { AbstractParser } from '@/parsers/AbstractParser';
import { StringField, ScalarDescriptor, FieldKind, Dictionary } from '@/types';
import { Pattern } from '@/lib/Pattern';

const TypeFormat: Dictionary<string> = {
  date: 'date',
  'date-time': 'datetime-local',
  email: 'email',
  'idn-email': 'email',
  time: 'time',
  uri: 'url'
};

export class StringParser extends AbstractParser<string, ScalarDescriptor, StringField> {
  public get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'string';
  }

  public get type(): string {
    if (this.field.attrs.input.type) {
      return this.field.attrs.input.type;
    }

    if (this.isEnumItem) {
      return 'radio';
    }

    return this.schema.format
      ? TypeFormat[this.schema.format]
      : 'text';
  }

  public parse() {
    super.parse();

    this.field.attrs.input.value = this.field.model;
    this.field.attrs.input.minlength = this.schema.minLength;
    this.field.attrs.input.maxlength = this.schema.maxLength;

    if (this.schema.pattern) {
      this.field.attrs.input.pattern = this.schema.pattern;
    } else if (this.schema.hasOwnProperty('const')) {
      this.field.attrs.input.pattern = Pattern.escape(`${this.schema.const}`);
    }
  }

  protected parseValue(data: unknown): string {
    return typeof data !== 'undefined' ? `${data}` : '';
  }
}
