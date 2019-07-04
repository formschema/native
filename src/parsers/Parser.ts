import { AbstractParserOptions } from '@/types';

import { Parent } from '@/parsers/AbstractParser';
import { ArrayParser } from '@/parsers/ArrayParser';
import { BooleanParser } from '@/parsers/BooleanParser';
import { IntegerParser } from '@/parsers/IntegerParser';
import { NullParser } from '@/parsers/NullParser';
import { NumberParser } from '@/parsers/NumberParser';
import { StringParser } from '@/parsers/StringParser';
import { ObjectParser } from '@/parsers/ObjectParser';
import { EnumParser } from '@/parsers/EnumParser';
import { ListParser } from '@/parsers/ListParser';

export type Parsers = ArrayParser
| BooleanParser
| IntegerParser
| NullParser
| NumberParser
| StringParser
| ObjectParser
| EnumParser
| ListParser;

export const Parser = Object.freeze({
  get(options: AbstractParserOptions<any, any>, parent?: Parent): Parsers | null {
    let parser = null;

    if (options.schema.enum instanceof Array) {
      parser = options.schema.enum.length > 4
        ? new ListParser(options, parent)
        : new EnumParser(options, parent);
    } else {
      switch (options.schema.type) {
        case 'array':
          parser = new ArrayParser(options, parent);
          break;

        case 'boolean':
          parser = new BooleanParser(options, parent);
          break;

        case 'integer':
          parser = new IntegerParser(options, parent);
          break;

        case 'null':
          parser = new NullParser(options, parent);
          break;

        case 'number':
          parser = new NumberParser(options, parent);
          break;

        case 'object':
          parser = new ObjectParser(options, parent);
          break;

        case 'string':
          parser = new StringParser(options, parent);
          break;

        default:
          if (typeof options.schema.type === 'undefined') {
            return null;
          }

          throw TypeError(`Unsupported schema type: ${JSON.stringify(options.schema.type)}`);
      }
    }

    parser.parse();

    return parser;
  }
});
