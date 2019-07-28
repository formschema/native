import { Parser } from '@/parsers/Parser';
import { BooleanParser } from '@/parsers/BooleanParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';
import { TestParser } from '../../lib/TestParser';

describe('parsers/BooleanParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'boolean' },
    model: undefined,
    descriptorConstructor: new NativeDescriptor(NativeElements)
  };

  const parser = new BooleanParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.field.input.attrs.type should equal to checkbox', () => {
    expect(parser.field.input.attrs.type).toBe('checkbox');
  });

  it('parser.field.input.attrs.checked should be falsy', () => {
    expect(parser.field.input.attrs.checked).toBeFalsy;
  });

  it('field.value should be falsy', () => {
    expect(parser.field.input.value).toBeFalsy();
  });

  it('should successfully parse default truthy boolean value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: true,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeTruthy();
  });

  it('field.value should successfully parse default falsy boolean value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: false,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeFalsy();
  });

  it('field.value should parse default non boolean value as a falsy model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: 12,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeFalsy();
  });

  TestParser.Case({
    case: '1.0',
    description: 'isEmpty() with non boolean',
    parser: new BooleanParser({
      schema: { type: 'boolean' },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function, parser: BooleanParser) => expect(fn.apply(parser, [undefined])).toBeTruthy()
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'isEmpty() with a falsy boolean',
    parser: new BooleanParser({
      schema: { type: 'boolean' },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function) => fn(false) === true
    }
  });

  TestParser.Case({
    case: '1.2',
    description: 'isEmpty() with a truthy boolean',
    parser: new BooleanParser({
      schema: { type: 'boolean' },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function, parser: BooleanParser) => expect(fn.apply(parser, [true])).toBeFalsy()
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'isEmpty() with default value',
    parser: new BooleanParser({
      schema: { type: 'boolean', default: true },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function, parser: BooleanParser) => expect(fn.apply(parser, [])).toBeFalsy()
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.reset()',
    parser: () => {
      const model = true;
      const onChange = jest.fn();
      const parser = new BooleanParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        expect(parser.rawValue).toBe(true);
        expect(parser.model).toBe(true);

        parser.field.input.setValue(false);

        expect(parser.rawValue).toBe(false);
        expect(parser.model).toBe(false);

        parser.reset(); // reset without calling onChange()

        expect(parser.rawValue).toBe(true);
        expect(parser.model).toBe(true);

        parser.field.input.reset(); // reset with calling onChange()

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual([true, false, true]);
      }
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'parser.clear()',
    parser: () => {
      const model = false;
      const onChange = jest.fn();
      const parser = new BooleanParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      clear(fn: Function, parser: any) {
        expect(parser.rawValue).toBe(false);
        expect(parser.model).toBe(false);

        parser.field.input.setValue(true);

        expect(parser.rawValue).toBe(true);
        expect(parser.model).toBe(true);

        parser.clear(); // clear without calling onChange()

        expect(parser.rawValue).toBeFalsy();
        expect(parser.model).toBeFalsy();

        parser.field.input.clear(); // clear with calling onChange()

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual([false, true, false]);
      }
    }
  });
});
