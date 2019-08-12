import { Parser } from '@/parsers/Parser';
import { NullParser } from '@/parsers/NullParser';
import { ParserOptions } from '@/types';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/NullParser', () => {
  const options: ParserOptions<any, any> = {
    schema: { type: 'null' },
    model: undefined
  };

  const parser = new NullParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('should have type === hidden', () => {
    expect(parser.field.attrs.type).toBe('hidden');
  });

  it('should have value === \u0000', () => {
    expect(parser.field.attrs.value).toBe('\u0000');
  });

  it('field.value should be equal to null', () => {
    expect(parser.field.value).toBe(null);
  });

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = null;
        const onChange = jest.fn();
        const parser = new NullParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
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

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual([null, null]);
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.clear()',
    given: {
      parser() {
        const model = null;
        const onChange = jest.fn();
        const parser = new NullParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
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

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual([null, null]);
        }
      }
    }
  });
});
