import { Parser } from '@/parsers/Parser';
import { BooleanParser } from '@/parsers/BooleanParser';
import { ParserOptions } from '@/types';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/BooleanParser', () => {
  const options: ParserOptions<any, any> = {
    schema: { type: 'boolean' },
    model: undefined
  };

  const parser = new BooleanParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.field.attrs.type should equal to checkbox', () => {
    expect(parser.field.attrs.type).toBe('checkbox');
  });

  it('parser.field.attrs.checked should be falsy', () => {
    expect(parser.field.attrs.checked).toBeFalsy;
  });

  it('field.value should be falsy', () => {
    expect(parser.field.value).toBeFalsy();
  });

  it('should successfully parse default truthy boolean value', () => {
    const options: ParserOptions<any, any> = {
      schema: { type: 'boolean' },
      model: true
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.value).toBeTruthy();
  });

  it('field.value should successfully parse default falsy boolean value', () => {
    const options: ParserOptions<any, any> = {
      schema: { type: 'boolean' },
      model: false
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.value).toBeFalsy();
  });

  it('field.value should parse default non boolean value as a falsy model', () => {
    const options: ParserOptions<any, any> = {
      schema: { type: 'boolean' },
      model: 12
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.value).toBeFalsy();
  });

  TestParser.Case({
    case: '1.0',
    description: 'isEmpty() with non boolean',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty('false')).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'isEmpty() with a falsy boolean',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty(false)).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '1.2',
    description: 'isEmpty() with a truthy boolean',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty(true)).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'isEmpty() with default value',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean', default: true }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty()).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = true;
        const onChange = jest.fn();
        const parser = new BooleanParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          expect(parser.rawValue).toBe(true);
          expect(parser.model).toBe(true);

          parser.field.setValue(false);

          expect(parser.rawValue).toBe(false);
          expect(parser.model).toBe(false);

          parser.reset(); // reset without calling onChange()

          expect(parser.rawValue).toBe(true);
          expect(parser.model).toBe(true);

          parser.field.reset(); // reset with calling onChange()

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual([true, false, true]);
        }
      }
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'parser.clear()',
    given: {
      parser() {
        const model = false;
        const onChange = jest.fn();
        const parser = new BooleanParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      },
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          expect(parser.rawValue).toBe(false);
          expect(parser.model).toBe(false);

          parser.field.setValue(true);

          expect(parser.rawValue).toBe(true);
          expect(parser.model).toBe(true);

          parser.clear(); // clear without calling onChange()

          expect(parser.rawValue).toBeFalsy();
          expect(parser.model).toBeFalsy();

          parser.field.clear(); // clear with calling onChange()

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual([false, true, false]);
        }
      }
    }
  });
});
