import { Parser } from '@/parsers/Parser';
import { ScalarParser } from '@/parsers/ScalarParser';
import { Value } from '@/lib/Value';
import { JsonSchema } from '@/types/jsonschema';

import {
  Dict,
  FieldKind,
  StringField,
  StringAttributes,
  ParserOptions,
  UnknowParser
} from '@/types';

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
    case 'radio':
    case 'hidden':
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

export class StringParser extends ScalarParser<string, StringField, StringAttributes> {
  constructor(options: ParserOptions<string>, parent?: UnknowParser) {
    const schema = options.schema;
    const kind = options.kind || ScalarParser.getKind(schema, parent) || getKind(schema);
    const type = ScalarParser.getType(kind) || getType(kind, schema);

    super(kind, type, options, parent);
  }

  isEmpty(data: unknown = this.model) {
    return typeof data === 'string' ? data.length === 0 : true;
  }

  parse() {
    if (this.attrs.type === 'file') {
      this.attrs.accept = this.schema.contentMediaType;
    }

    if (this.attrs.type) {
      Object.defineProperty(this.attrs, 'value', {
        enumerable: true,
        configurable: true,
        get: () => this.model
      });

      if (this.schema.pattern) {
        this.attrs.pattern = this.schema.pattern;
      }
    }

    this.attrs.minlength = this.schema.minLength;
    this.attrs.maxlength = this.schema.maxLength;

    this.commit();
  }

  parseValue(data: unknown) {
    return Value.string(data);
  }
}

Parser.register('string', StringParser);
Parser.register('file', StringParser);
Parser.register('image', StringParser);
Parser.register('textarea', StringParser);
