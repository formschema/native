import { Parser } from '@/parsers/Parser';
import { NullParser } from '@/parsers/NullParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { TestParser } from '../../lib/TestParser';

describe('parsers/NullParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'null' },
    model: undefined,
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new NullParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('should have type === hidden', () => {
    expect(parser.field.input.attrs.type).toBe('hidden');
  });

  it('should have value === \u0000', () => {
    expect(parser.field.input.attrs.value).toBe('\u0000');
  });

  it('field.value should be equal to null', () => {
    expect(parser.field.input.value).toBe(null);
  });

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    parser: () => {
      const model = null;
      const onChange = jest.fn();
      const parser = new NullParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        expect(parser.rawValue).toBe(null);
        expect(parser.model).toBe(null);

        parser.reset(); // reset without calling onChange

        expect(parser.rawValue).toBe(null);
        expect(parser.model).toBe(null);

        parser.field.input.reset(); // reset with calling onChange

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual([null, null]);
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.clear()',
    parser: () => {
      const model = null;
      const onChange = jest.fn();
      const parser = new NullParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      clear(fn: Function, parser: any) {
        expect(parser.rawValue).toBe(null);
        expect(parser.model).toBe(null);

        parser.clear(); // clear without calling onChange

        expect(parser.rawValue).toBe(null);
        expect(parser.model).toBe(null);

        parser.field.input.clear(); // clear with calling onChange

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual([null, null]);
      }
    }
  });
});
