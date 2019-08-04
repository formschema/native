import { Parser } from '@/parsers/Parser';
import { StringParser } from '@/parsers/StringParser';
import { Dictionary, ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';
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
    descriptorConstructor: new NativeDescriptor(NativeElements)
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
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
        descriptorConstructor: new NativeDescriptor(NativeElements)
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.attrs.pattern).toBe(options.schema.pattern);
  });

  it('field.input.attrs.pattern should be equal to schema.const', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', const: 'arya' },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.attrs.pattern).toBe(options.schema.const);
  });

  it('field.input.attrs.pattern should be equal to escaped schema.const', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', const: 'f(x) = ax + b; a = { 1, 2 }' },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.attrs.pattern).toBe('f\\(x\\) = ax \\+ b; a = \\{ 1, 2 \\}');
  });

  it('should parse default undefined value as an undefined string', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
  });

  it('should parse default non string value as a string', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: 12,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new StringParser(options);

    parser.parse();

    expect(parser.field.input.value).toBe('12');
  });

  TestParser.Case({
    case: '1.0',
    description: 'schema.contentMediaType with `text/*`',
    parser: new StringParser({
      schema: { type: 'string', contentMediaType: 'text/plain' },
      model: undefined as any,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      kind: (value: string) => expect(value).toBe('textarea'),
      type: (value: string) => expect(value).toBeUndefined(),
      attrs: {
        accept: (value: string) => expect(value).toBeUndefined()
      },
      field: {
        kind(value: string, parser: StringParser) {
          expect(value).toBe(parser.kind);
        }
      },
      descriptor: {
        kind(value: string, parser: StringParser) {
          expect(value).toBe(parser.kind);
        }
      }
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'schema.contentMediaType with `image/*`',
    parser: new StringParser({
      schema: { type: 'string', contentMediaType: 'image/png' },
      model: undefined as any,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      kind: (value: string) => expect(value).toBe('image'),
      type: (value: string) => expect(value).toBe('file'),
      attrs: {
        accept(value: string, { options }: StringParser) {
          expect(value).toBe(options.schema.contentMediaType);
        }
      },
      field: {
        kind(value: string, parser: StringParser) {
          expect(value).toBe(parser.kind);
        }
      },
      descriptor: {
        kind(value: string, parser: StringParser) {
          expect(value).toBe(parser.kind);
        }
      }
    }
  });

  TestParser.Case({
    case: '1.2',
    description: 'schema.contentMediaType with custom descriptor.kind',
    parser: new StringParser({
      schema: { type: 'string', contentMediaType: 'audio/ogg' },
      model: undefined as any,
      descriptor: { kind: 'string' },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      kind: (value: string) => expect(value).toBe('file'),
      type: (value: string) => expect(value).toBe('file'),
      attrs: {
        accept(value: string, { options }: StringParser) {
          expect(value).toBe(options.schema.contentMediaType);
        }
      },
      field: {
        kind(value: string, parser: StringParser) {
          expect(value).toBe(parser.kind);
        }
      },
      descriptor: {
        kind(value: string, parser: any) {
          expect(value).toBe(parser.options.descriptor.kind);
          expect(value).not.toBe(parser.kind);
        }
      }
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'any other values for schema.contentMediaType',
    parser: new StringParser({
      schema: { type: 'string', contentMediaType: 'any/mime' },
      model: undefined as any,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      kind: (value: string) => expect(value).toBe('file'),
      type: (value: string) => expect(value).toBe('file'),
      attrs: {
        accept(value: string, { options }: StringParser) {
          expect(value).toBe(options.schema.contentMediaType);
        }
      },
      field: {
        kind(value: string, parser: StringParser) {
          expect(value).toBe(parser.kind);
        }
      },
      descriptor: {
        kind(value: string, parser: StringParser) {
          expect(value).toBe(parser.kind);
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.isEmpty() with non empty string',
    parser: new StringParser({
      schema: { type: 'string' },
      model: undefined as any,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function) => expect(fn('non empty')).toBeFalsy()
    }
  });

  TestParser.Case({
    case: '2.1',
    description: 'parser.isEmpty() with an empty string',
    parser: new StringParser({
      schema: { type: 'string' },
      model: undefined as any,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function) => expect(fn('')).toBeTruthy()
    }
  });

  TestParser.Case({
    case: '2.2',
    description: 'parser.isEmpty() with a non string',
    parser: new StringParser({
      schema: { type: 'string' },
      model: 12 as any,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function, parser: StringParser) => expect(fn.apply(parser, [12])).toBeTruthy()
    }
  });

  TestParser.Case({
    case: '2.3',
    description: 'parser.isEmpty() with default value',
    parser: new StringParser({
      schema: { type: 'string' },
      model: 'hello' as any,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function, parser: StringParser) => expect(fn.apply(parser, [])).toBeFalsy()
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'parser.reset()',
    parser: () => {
      const model = 'arya';
      const onChange = jest.fn();
      const parser = new StringParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        expect(parser.rawValue).toBe('arya');
        expect(parser.model).toBe('arya');

        parser.field.input.setValue('jon');

        expect(parser.rawValue).toBe('jon');
        expect(parser.model).toBe('jon');

        parser.reset(); // reset without calling onChange

        expect(parser.rawValue).toBe('arya');
        expect(parser.model).toBe('arya');

        parser.field.input.reset(); // reset with calling onChange

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual(['arya', 'jon', 'arya']);
      }
    }
  });

  TestParser.Case({
    case: '4.0',
    description: 'parser.clear()',
    parser: () => {
      const model = 'arya';
      const onChange = jest.fn();
      const parser = new StringParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      clear(fn: Function, parser: any) {
        expect(parser.rawValue).toBe('arya');
        expect(parser.model).toBe('arya');

        parser.field.input.setValue('jon');

        expect(parser.rawValue).toBe('jon');
        expect(parser.model).toBe('jon');

        parser.clear(); // clear without calling onChange

        expect(parser.rawValue).toBeUndefined();
        expect(parser.model).toBeUndefined();

        parser.field.input.clear(); // clear with calling onChange

        const onChange = parser.options.onChange;
        const result = onChange.mock.calls.map(([value]: any) => value);

        expect(result).toEqual(['arya', 'jon', undefined]);
      }
    }
  });
});
