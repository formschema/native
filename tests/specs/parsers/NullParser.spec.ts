import { NullParser } from '@/parsers/NullParser';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/NullParser', () => {
  TestParser.Case({
    case: '0.0',
    given: {
      parser: new NullParser({
        schema: { type: 'null' },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('hidden'),
            value: ({ value }: Scope) => expect(value).toBe('\u0000')
          },
          value: ({ value }: Scope) => expect(value).toBeNull()
        }
      }
    }
  });

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    given: {
      parser: new NullParser({
        schema: { type: 'null' },
        model: null,
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          expect(parser.rawValue).toBe(null);
          expect(parser.model).toBe(null);

          parser.reset(); // reset without calling onChange

          expect(parser.rawValue).toBe(null);
          expect(parser.model).toBe(null);

          parser.field.reset(); // reset with calling onChange

          const onChange = parser.options.onChange;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ null, null ]);
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.clear()',
    given: {
      parser: new NullParser({
        schema: { type: 'null' },
        model: null,
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          expect(parser.rawValue).toBe(null);
          expect(parser.model).toBe(null);

          parser.clear(); // clear without calling onChange

          expect(parser.rawValue).toBe(null);
          expect(parser.model).toBe(null);

          parser.field.clear(); // clear with calling onChange

          const onChange = parser.options.onChange;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ null, null ]);
        }
      }
    }
  });
});
