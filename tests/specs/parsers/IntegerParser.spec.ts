import { Parser } from '@/parsers/Parser';
import { IntegerParser } from '@/parsers/IntegerParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';
import { TestParser } from '../../lib/TestParser';

describe('parsers/IntegerParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: {
      type: 'integer',
      minimum: 0,
      maximum: 10,
      multipleOf: 2
    },
    model: 2,
    descriptorConstructor: new NativeDescriptor(NativeElements)
  };

  const parser = new IntegerParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `integer` for integer schema', () => {
    expect(parser.kind).toBe('integer');
  });

  it('parser.kind should be equal to `radio` for enum field', () => {
    const options: ParserOptions<number, ScalarDescriptor> = {
        schema: { type: 'integer' },
        model: 1,
        descriptorConstructor: new NativeDescriptor(NativeElements)
      };

      const parser: any = new IntegerParser(options);

      parser.isEnumItem = true;

      parser.parse();

    expect(parser.kind).toBe('radio');
  });

  it('parser.type should have equal to `number` integer schema', () => {
    expect(parser.type).toBe('number');
  });

  it('field.input.attrs.type should be equal to parser.type', () => {
    expect(parser.field.input.attrs.type).toBe(parser.type);
  });

  it('field.input.attrs.min should be equal to schema.minimum', () => {
    expect(parser.field.input.attrs.min).toBe(options.schema.minimum);
  });

  it('field.input.attrs.max should be equal to schema.maximum', () => {
    expect(parser.field.input.attrs.max).toBe(options.schema.maximum);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.input.value).toBe(2);
  });

  it('this.field.input.attrs.value should be equal to field.value', () => {
    expect(parser.field.input.attrs.value).toBe('2');
  });

  it('should successfully parse default integer value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'integer' },
      model: 3,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new IntegerParser(options);

    parser.parse();

    expect(parser.field.input.value).toBe(3);
  });

  it('field.value should parse default non integer value as an undefined model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'integer' },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new IntegerParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
  });

  describe('exclusiveMinimum/exclusiveMaximum', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'integer',
        exclusiveMinimum: 0,
        exclusiveMaximum: 10
      },
      model: 0,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new IntegerParser(options);

    parser.parse();

    it('field.input.attrs.min should equal define using schema.exclusiveMinimum', () => {
      expect(parser.field.input.attrs.min).toBe(1);
    });

    it('field.input.attrs.max should equal define using schema.exclusiveMaximum', () => {
      expect(parser.field.input.attrs.max).toBe(9);
    });
  });

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    parser: () => {
      const model = 2;
      const onChange = jest.fn();
      const parser = new IntegerParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        expect(parser.rawValue).toBe(2);
        expect(parser.model).toBe(2);

        parser.field.input.setValue(1);

        expect(parser.rawValue).toBe(1);
        expect(parser.model).toBe(1);

        parser.reset(); // reset without calling onChange

        expect(parser.rawValue).toBe(2);
        expect(parser.model).toBe(2);

        parser.field.input.reset(); // reset with calling onChange

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual([2, 1, 2]);
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.clear()',
    parser: () => {
      const model = 2;
      const onChange = jest.fn();
      const parser = new IntegerParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      clear(fn: Function, parser: any) {
        expect(parser.rawValue).toBe(2);
        expect(parser.model).toBe(2);

        parser.field.input.setValue(1);

        expect(parser.rawValue).toBe(1);
        expect(parser.model).toBe(1);

        parser.clear(); // clear without calling onChange

        expect(parser.rawValue).toBeUndefined();
        expect(parser.model).toBeUndefined();

        parser.field.input.clear(); // clear with calling onChange

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual([2, 1, undefined]);
      }
    }
  });
});
