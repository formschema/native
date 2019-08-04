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

const TypeFileMime = [ 'image/', 'audio/', 'application/' ];

export class StringParser extends Parser<string, StringField, ScalarDescriptor, StringAttributes> {
  get kind(): FieldKind {
    if (this.isEnumItem) {
      return 'radio';
    }

    if (this.schema.contentMediaType) {
      if (this.schema.contentMediaType.startsWith('text/')) {
        return 'textarea';
      }
    }

    return 'string';
  }

  get type() {
    if (this.kind === 'textarea') {
      return undefined;
    }

    if (this.isEnumItem) {
      return 'radio';
    }

    if (this.schema.contentMediaType) {
      const mime = this.schema.contentMediaType;
      const isMimeFile = TypeFileMime.some((prefix) => mime.startsWith(prefix));

      if (isMimeFile) {
        return 'file';
      }
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
