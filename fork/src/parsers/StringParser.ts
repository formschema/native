import { AbstractParser } from '@/parsers/AbstractParser';
import { StringField, ScalarDescriptor, FieldKind } from '@/types';

export class StringParser extends AbstractParser<string, ScalarDescriptor, StringField> {
  get kind(): FieldKind {
    return this.isEnum ? 'radio' : 'string';
  }

  get type() {
    if (this.field.attrs.input.type) {
      return this.field.attrs.input.type;
    }

    if (this.isEnum) {
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

  setValue(value: any) {
    if (this.isEnum && this.parent) {
      this.parent.field.model = this.field.model;
    } else {
      this.field.model = this.parseValue(value);
    }
  }

  parse() {
    this.parseField();

    this.field.attrs.input.value = this.field.model;
    this.field.attrs.input.minlength = this.schema.minLength;
    this.field.attrs.input.maxlength = this.schema.maxLength;
    this.field.attrs.input.pattern = this.schema.pattern;
  }

  parseValue(data: any): string {
    return typeof data !== 'undefined' ? `${data}` : '';
  }
}
