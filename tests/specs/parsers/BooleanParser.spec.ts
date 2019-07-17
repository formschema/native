import { Parser } from '@/parsers/Parser';
import { BooleanParser } from '@/parsers/BooleanParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { TestParser } from '../../lib/TestParser';

describe('parsers/BooleanParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'boolean' },
    model: undefined,
    descriptorConstructor: NativeDescriptor.get
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
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeTruthy();
  });

  it('field.value should successfully parse default falsy boolean value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: false,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeFalsy();
  });

  it('field.value should parse default non boolean value as an undefined model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: 12,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
  });

  TestParser.Case({
    case: '1.0',
    description: 'isEmpty() with non boolean',
    parser: new BooleanParser({
      schema: { type: 'boolean' },
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function, parser: BooleanParser) => fn.apply(parser, [undefined]) === true
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'isEmpty() with a falsy boolean',
    parser: new BooleanParser({
      schema: { type: 'boolean' },
      descriptorConstructor: NativeDescriptor.get
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
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function, parser: BooleanParser) => fn.apply(parser, [true]) === false
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'isEmpty() with default value',
    parser: new BooleanParser({
      schema: { type: 'boolean', default: true },
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function, parser: BooleanParser) => fn.apply(parser, []) === false
    }
  });
});
