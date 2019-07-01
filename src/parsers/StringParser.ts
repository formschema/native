import { AbstractParser } from '@/parsers/AbstractParser';
import { StringField, ScalarDescriptor, FieldKind } from '@/types';
import { Pattern } from '@/lib/Pattern';

export class StringParser extends AbstractParser<string, ScalarDescriptor, StringField> {
  public get kind(): FieldKind {
    return this.isEnumItem ? 'radio' : 'string';
  }

  public get type() {
    if (this.field.attrs.input.type) {
      return this.field.attrs.input.type;
    }

    if (this.isEnumItem) {
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
