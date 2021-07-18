import { Parser } from '@/parsers/Parser';
import { ScalarParser } from '@/parsers/ScalarParser';
import { Value } from '@/lib/Value';
import { JsonSchema } from '../../types/jsonschema';

import {
  Dict,
  FieldKind,
  StringField,
  ParserOptions,
  UnknowParser,
  ScalarDescriptor
} from '../../types';

const TypeFormat: Dict<string> = {
  date: 'date',
  'date-time': 'datetime-local',
  email: 'email',
  'idn-email': 'email',
  time: 'time',
  uri: 'url'
};

function getKind(schema: JsonSchema) {
  if (schema.contentMediaType) {
    const mime = schema.contentMediaType;

    if (mime.startsWith('text/')) {
      return 'textarea';
    }

    if (mime.startsWith('image/')) {
      return 'image';
    }

    return 'file';
  }

  return 'string';
}

function getType(kind: FieldKind, schema: JsonSchema) {
  switch (kind) {
    case 'file':
    case 'password':
      return kind;

    case 'image':
      return 'file';

    case 'textarea':
      return undefined;

    default:
      return schema.format
        ? TypeFormat[schema.format]
        : 'text';
  }
}

export class StringParser extends ScalarParser<string, StringField> {
  constructor(options: ParserOptions<string, StringField, ScalarDescriptor>, parent?: UnknowParser) {
    const schema = options.schema;
    const kind = options.kind || ScalarParser.getKind(schema, parent) || getKind(schema);
    const type = ScalarParser.getType(kind) || getType(kind, schema);

    super(kind, type, options, parent);
  }

  isEmpty(data: unknown = this.model): boolean {
    return typeof data === 'string' ? data.length === 0 : true;
  }

  parseField(): void {
    super.parseField();

    if (this.field.attrs.type === 'file') {
      this.field.attrs.accept = this.schema.contentMediaType;
    }

    if (this.field.attrs.type) {
      Object.defineProperty(this.field.attrs, 'value', {
        enumerable: true,
        configurable: true,
        get: () => this.model
      });

      if (this.schema.pattern) {
        this.field.attrs.pattern = this.schema.pattern;
      }
    }

    this.field.attrs.minlength = this.schema.minLength;
    this.field.attrs.maxlength = this.schema.maxLength;
  }

  parseValue(data: unknown): string | undefined {
    return Value.string(data);
  }
}

Parser.register('string', StringParser);
Parser.register('password', StringParser);
Parser.register('file', StringParser);
Parser.register('image', StringParser);
Parser.register('textarea', StringParser);
