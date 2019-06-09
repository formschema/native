import { AbstractParser } from '@/parsers/AbstractParser';
import { StringField, ScalarDescriptor } from '@/types';

export class StringParser extends AbstractParser<string, ScalarDescriptor, StringField> {
  get type() {
    if (this.field.kind === 'radio') {
      return 'radio';
    }

    switch (this.schema.format) {
      case 'date':
        return 'date';

      case 'date-time':
        return 'datetime-local';

      case 'email':
      case 'idn-email':
        return 'email';

      case 'time':
        return 'time';

      case 'uri':
        return 'url';

      default:
        return 'text';
    }
  }

  parse() {
    this.field.kind = this.parent && this.parent.schema.enum ? 'radio' : 'string';
    this.field.attrs.input.minlength = this.schema.minLength;
    this.field.attrs.input.maxlength = this.schema.maxLength;
    this.field.attrs.input.pattern = this.schema.pattern;

    if (!this.field.attrs.input.type) {
      this.field.attrs.input.type = this.type;
    }

    this.parseField();
    this.parseInputValue();
  }

  parseValue(data: any): string {
    return typeof data !== 'undefined' ? `${data}` : '';
  }
}
