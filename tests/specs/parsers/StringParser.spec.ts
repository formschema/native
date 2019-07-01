import { AbstractParser } from '@/parsers/AbstractParser';
import { StringParser } from '@/parsers/StringParser';
import { Dictionary, ScalarDescriptor, AbstractParserOptions } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';

describe('parsers/StringParser', () => {
  const options: AbstractParserOptions<string, ScalarDescriptor> = {
    schema: {
      type: 'string',
      pattern: 'arya|jon',
      minLength: 5,
      maxLength: 15
    },
    model: 'Goku',
    descriptorConstructor: NativeDescriptor.get,
    $forceUpdate: () => {}
  };

  const parser = new StringParser(options);

  parser.parse();

  it('parser should be an instance of AbstractParser', () => {
    expect(parser).toBeInstanceOf(AbstractParser);
  });

  it('parser.kind should have equal to `string` for non enum field', () => {
    expect(parser.kind).toBe('string');
  });

  it('parser.type should have equal to `text` string schema', () => {
    expect(parser.type).toBe('text');
  });

  it('field.attrs.input.type should be equal to `text`', () => {
    expect(parser.field.attrs.input.type).toBe('text');
  });

  it('field.attrs.input.type should be equal to `radio` for enum field', () => {
    const options: AbstractParserOptions<string, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: '',
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser: any = new StringParser(options);

    parser.isEnumItem = true;

    parser.parse();

    expect(parser.field.attrs.input.type).toBe('radio');
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

    it(`field.attrs.input.type should be equal to '${type}' with schema.format === '${format}'`, () => {
      const options: AbstractParserOptions<string, ScalarDescriptor> = {
        schema: { type: 'string', format },
        model: '',
        descriptorConstructor: NativeDescriptor.get,
        $forceUpdate: () => {}
      };

      const parser = new StringParser(options);

      parser.parse();

      expect(parser.field.attrs.input.type).toBe(type);
    });
  });

  it('field.model should be equal to the default value', () => {
    expect(parser.field.model).toBe('Goku');
  });

  it('field.attrs.input.value should be equal to field.model', () => {
    expect(parser.field.attrs.input.value).toBe(parser.field.model);
  });

  it('field.attrs.input.minlength should be equal to schema.minLength', () => {
    expect(parser.field.attrs.input.minlength).toBe(options.schema.minLength);
  });

  it('field.attrs.input.maxlength should be equal to schema.maxLength', () => {
    expect(parser.field.attrs.input.maxlength).toBe(options.schema.maxLength);
  });

  it('field.attrs.input.pattern should be equal to schema.pattern', () => {
    expect(parser.field.attrs.input.pattern).toBe(options.schema.pattern);
  });

  it('field.attrs.input.pattern should be equal to schema.pattern with provided schema.const', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', pattern: 'arya|jon', const: 'arya' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.attrs.input.pattern).toBe(options.schema.pattern);
  });

  it('field.attrs.input.pattern should be equal to schema.const', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', const: 'arya' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.attrs.input.pattern).toBe(options.schema.const);
  });

  it('field.attrs.input.pattern should be equal to escaped schema.const', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', const: 'f(x) = ax + b; a = { 1, 2 }' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.attrs.input.pattern).toBe('f\\(x\\) = ax \\+ b; a = \\{ 1, 2 \\}');
  });

  it('should parse default undefined value as an empty string', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.model).toBe('');
  });

  it('should parse default non string value as a string', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: 12,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.model).toBe('12');
  });
});
