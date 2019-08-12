import { Parser } from '@/parsers/Parser';
import { IntegerParser } from '@/parsers/IntegerParser';
import { ParserOptions } from '@/types';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/IntegerParser', () => {
  const options: ParserOptions<any, any> = {
    schema: {
      type: 'integer',
      minimum: 0,
      maximum: 10,
      multipleOf: 2
    },
    model: 2
  };

  const parser = new IntegerParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `integer` for integer schema', () => {
    expect(parser.kind).toBe('integer');
  });

  it('parser.attrs.type should have equal to `number` integer schema', () => {
    expect(parser.attrs.type).toBe('number');
  });

  it('field.attrs.type should be equal to parser.attrs.type', () => {
    expect(parser.field.attrs.type).toBe(parser.attrs.type);
  });

  it('field.attrs.min should be equal to schema.minimum', () => {
    expect(parser.field.attrs.min).toBe(options.schema.minimum);
  });

  it('field.attrs.max should be equal to schema.maximum', () => {
    expect(parser.field.attrs.max).toBe(options.schema.maximum);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.value).toBe(2);
  });

  it('this.field.attrs.value should be equal to field.value', () => {
    expect(parser.field.attrs.value).toBe('2');
  });

  it('should successfully parse default integer value', () => {
    const options: ParserOptions<any, any> = {
      schema: { type: 'integer' },
      model: 3
    };

    const parser = new IntegerParser(options);

    parser.parse();

    expect(parser.field.value).toBe(3);
  });

  it('field.value should parse default non integer value as an undefined model', () => {
    const options: ParserOptions<any, any> = {
      schema: { type: 'integer' },
      model: undefined
    };

    const parser = new IntegerParser(options);

    parser.parse();

    expect(parser.field.value).toBeUndefined();
  });

  describe('exclusiveMinimum/exclusiveMaximum', () => {
    const options: ParserOptions<any, any> = {
      schema: {
        type: 'integer',
        exclusiveMinimum: 0,
        exclusiveMaximum: 10
      },
      model: 0
    };

    const parser = new IntegerParser(options);

    parser.parse();

    it('field.attrs.min should equal define using schema.exclusiveMinimum', () => {
      expect(parser.field.attrs.min).toBe(1);
    });

    it('field.attrs.max should equal define using schema.exclusiveMaximum', () => {
      expect(parser.field.attrs.max).toBe(9);
    });
  });

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = 2;
        const onChange = jest.fn();
        const parser = new IntegerParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          expect(parser.rawValue).toBe(2);
          expect(parser.model).toBe(2);

          parser.field.setValue(1);

          expect(parser.rawValue).toBe(1);
          expect(parser.model).toBe(1);

          parser.reset(); // reset without calling onChange

          expect(parser.rawValue).toBe(2);
          expect(parser.model).toBe(2);

          parser.field.reset(); // reset with calling onChange

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual([2, 1, 2]);
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.clear()',
    given: {
      parser() {
        const model = 2;
        const onChange = jest.fn();
        const parser = new IntegerParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          expect(parser.rawValue).toBe(2);
          expect(parser.model).toBe(2);

          parser.field.setValue(1);

          expect(parser.rawValue).toBe(1);
          expect(parser.model).toBe(1);

          parser.clear(); // clear without calling onChange

          expect(parser.rawValue).toBeUndefined();
          expect(parser.model).toBeUndefined();

          parser.field.clear(); // clear with calling onChange

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual([2, 1, undefined]);
        }
      }
    }
  });
});
