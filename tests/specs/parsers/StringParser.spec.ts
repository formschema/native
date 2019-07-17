import { Parser } from '@/parsers/Parser';
import { StringParser } from '@/parsers/StringParser';
import { Dictionary, ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { TestParser } from '../../lib/TestParser';

describe('parsers/StringParser', () => {
  const options: ParserOptions<string, ScalarDescriptor> = {
    schema: {
      type: 'string',
      pattern: 'arya|jon',
      minLength: 5,
      maxLength: 15
    },
    model: 'Goku',
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new StringParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `string` for non enum field', () => {
    expect(parser.kind).toBe('string');
  });

  it('parser.type should have equal to `text` string schema', () => {
    expect(parser.type).toBe('text');
  });

  it('field.input.attrs.type should be equal to `text`', () => {
    expect(parser.field.input.attrs.type).toBe('text');
  });

  it('parser.type should be equal to `radio` for enum field', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new StringParser(options);

    parser.isEnumItem = true;

    expect(parser.type).toBe('radio');
  });

  const formatTypes: Dictionary = {
    date: 'date',
    'date-time': 'datetime-local',
    email: 'email',
    'idn-email': 'email',
    time: 'time',
    uri: 'url'
  };

  Object.keys(formatTypes).forEach((format) => {
    const type = formatTypes[format];

    it(`field.input.attrs.type should be equal to '${type}' with schema.format === '${format}'`, () => {
      const options: ParserOptions<string, ScalarDescriptor> = {
        schema: { type: 'string', format },
        model: '',
        descriptorConstructor: NativeDescriptor.get
      };

      const parser = new StringParser(options);

      parser.parse();

      expect(parser.field.input.attrs.type).toBe(type);
    });
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.input.value).toBe('Goku');
  });

  it('field.input.attrs.value should be equal to field.value', () => {
    expect(parser.field.input.attrs.value).toBe(parser.field.input.value);
  });

  it('field.input.attrs.minlength should be equal to schema.minLength', () => {
    expect(parser.field.input.attrs.minlength).toBe(options.schema.minLength);
  });

  it('field.input.attrs.maxlength should be equal to schema.maxLength', () => {
    expect(parser.field.input.attrs.maxlength).toBe(options.schema.maxLength);
  });

  it('field.input.attrs.pattern should be equal to schema.pattern', () => {
    expect(parser.field.input.attrs.pattern).toBe(options.schema.pattern);
  });

  it('field.input.attrs.pattern should be equal to schema.pattern with provided schema.const', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', pattern: 'arya|jon', const: 'arya' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.attrs.pattern).toBe(options.schema.pattern);
  });

  it('field.input.attrs.pattern should be equal to schema.const', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', const: 'arya' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.attrs.pattern).toBe(options.schema.const);
  });

  it('field.input.attrs.pattern should be equal to escaped schema.const', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', const: 'f(x) = ax + b; a = { 1, 2 }' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.attrs.pattern).toBe('f\\(x\\) = ax \\+ b; a = \\{ 1, 2 \\}');
  });

  it('should parse default undefined value as an undefined string', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
  });

  it('should parse default non string value as a string', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: 12,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.value).toBe('12');
  });

  TestParser.Case({
    case: '1.0',
    description: 'isEmpty() with non empty string',
    parser: new StringParser({
      schema: { type: 'string' },
      model: undefined as any,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function) => fn('non empty') === false
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'isEmpty() with an empty string',
    parser: new StringParser({
      schema: { type: 'string' },
      model: undefined as any,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function) => fn('') === true
    }
  });

  TestParser.Case({
    case: '1.2',
    description: 'isEmpty() with a non string',
    parser: new StringParser({
      schema: { type: 'string' },
      model: 12 as any,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function, parser: StringParser) => fn.apply(parser, [12]) === true
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'isEmpty() with default value',
    parser: new StringParser({
      schema: { type: 'string' },
      model: 'hello' as any,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function, parser: StringParser) => fn.apply(parser, []) === false
    }
  });
});
