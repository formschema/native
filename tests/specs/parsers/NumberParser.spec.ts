import { Parser } from '@/parsers/Parser';
import { NumberParser } from '@/parsers/NumberParser';
import { ParserOptions } from '@/types';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/NumberParser', () => {
  const options: ParserOptions<any, any> = {
    schema: {
      type: 'number',
      minimum: 0,
      maximum: 10,
      multipleOf: 2
    },
    model: 2.0
  };

  const parser = new NumberParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `number` for number schema', () => {
    expect(parser.kind).toBe('number');
  });

  it('field.attrs.type should have equal to `number` number schema', () => {
    expect(parser.field.attrs.type).toBe('number');
  });

  it('field.attrs.min should be equal to schema.minimum', () => {
    expect(parser.field.attrs.min).toBe(options.schema.minimum);
  });

  it('field.attrs.max should be equal to schema.maximum', () => {
    expect(parser.field.attrs.max).toBe(options.schema.maximum);
  });

  it('field.attrs.step should be equal to schema.multipleOf', () => {
    expect(parser.field.attrs.step).toBe(options.schema.multipleOf);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.value).toBe(2.0);
  });

  it('this.field.attrs.value should be equal to field.value', () => {
    expect(parser.field.attrs.value).toBe('2');
  });

  it('should successfully parse default number value', () => {
    const options: ParserOptions<any, any> = {
      schema: { type: 'number' },
      model: 3.1
    };

    const parser = new NumberParser(options);

    parser.parse();

    expect(parser.field.value).toBe(3.1);
  });

  it('field.value should parse default non number value as an undefined model', () => {
    const options: ParserOptions<any, any> = {
      schema: { type: 'number' },
      model: undefined
    };

    const parser = new NumberParser(options);

    parser.parse();

    expect(parser.field.value).toBeUndefined();
  });

  describe('exclusiveMinimum/exclusiveMaximum', () => {
    const options: ParserOptions<any, any> = {
      schema: {
        type: 'number',
        exclusiveMinimum: 0,
        exclusiveMaximum: 10
      },
      model: 0
    };

    const parser = new NumberParser(options);

    parser.parse();

    it('field.attrs.min should equal define using schema.exclusiveMinimum', () => {
      expect(parser.field.attrs.min).toBe(0.1);
    });

    it('field.attrs.max should equal define using schema.exclusiveMaximum', () => {
      expect(parser.field.attrs.max).toBe(9.9);
    });
  });

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = 2.1;
        const onChange = jest.fn();
        const parser = new NumberParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          expect(parser.rawValue).toBe(2.1);
          expect(parser.model).toBe(2.1);

          parser.field.setValue(1.1);

          expect(parser.rawValue).toBe(1.1);
          expect(parser.model).toBe(1.1);

          parser.reset(); // reset without calling onChange

          expect(parser.rawValue).toBe(2.1);
          expect(parser.model).toBe(2.1);

          parser.field.reset(); // reset with calling onChange

          const { onChange } = parser.options;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ 2.1, 1.1, 2.1 ]);
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.clear()',
    given: {
      parser() {
        const model = 2.1;
        const onChange = jest.fn();
        const parser = new NumberParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          expect(parser.rawValue).toBe(2.1);
          expect(parser.model).toBe(2.1);

          parser.field.setValue(1.1);

          expect(parser.rawValue).toBe(1.1);
          expect(parser.model).toBe(1.1);

          parser.clear(); // clear without calling onChange

          expect(parser.rawValue).toBeUndefined();
          expect(parser.model).toBeUndefined();

          parser.field.clear(); // clear with calling onChange

          const { onChange } = parser.options;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ 2.1, 1.1, undefined ]);
        }
      }
    }
  });
});
