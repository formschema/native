import { NumberParser } from '@/parsers/NumberParser';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/NumberParser', () => {
  TestParser.Case({
    case: '0.0',
    description: 'parser.reset()',
    given: {
      parser: new NumberParser({
        schema: {
          type: 'number',
          minimum: 0,
          maximum: 10,
          multipleOf: 2
        },
        model: 2.0
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('number'),
        field: {
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('number'),
            min: ({ value, options }: Scope) => expect(value).toBe(options.schema.minimum),
            max: ({ value, options }: Scope) => expect(value).toBe(options.schema.maximum),
            step: ({ value, options }: Scope) => expect(value).toBe(options.schema.multipleOf),
            value: ({ value, options }: Scope) => expect(value).toBe(`${options.model}`)
          },
          value: ({ value, options }: Scope) => expect(value).toBe(options.model)
        }
      }
    }
  });

  it('should successfully parse default number value', () => {
    const parser = new NumberParser({
      schema: { type: 'number' },
      model: 3.1
    });

    parser.parse();

    expect(parser.field.value).toBe(3.1);
  });

  it('field.value should parse default non number value as an undefined model', () => {
    const parser = new NumberParser({
      schema: { type: 'number' },
      model: undefined
    });

    parser.parse();

    expect(parser.field.value).toBeUndefined();
  });

  describe('exclusiveMinimum/exclusiveMaximum', () => {
    const parser = new NumberParser({
      schema: {
        type: 'number',
        exclusiveMinimum: 0,
        exclusiveMaximum: 10
      },
      model: 0
    });

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
      parser: new NumberParser({
        schema: {
          type: 'number',
          minimum: 0,
          maximum: 10,
          multipleOf: 2
        },
        model: 2.1,
        onChange: jest.fn()
      })
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
      parser: new NumberParser({
        schema: {
          type: 'number',
          minimum: 0,
          maximum: 10,
          multipleOf: 2
        },
        model: 2.1,
        onChange: jest.fn()
      })
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
