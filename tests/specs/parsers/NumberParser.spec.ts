import { Parser } from '@/parsers/Parser';
import { NumberParser } from '@/parsers/NumberParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

describe('parsers/NumberParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: {
      type: 'number',
      minimum: 0,
      maximum: 10,
      multipleOf: 2
    },
    model: 2.0,
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new NumberParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `number` for number schema', () => {
    expect(parser.kind).toBe('number');
  });

  it('parser.kind should be equal to `radio` for enum field', () => {
    const options: ParserOptions<number, ScalarDescriptor> = {
        schema: { type: 'number' },
        model: 1,
        descriptorConstructor: NativeDescriptor.get
      };

      const parser: any = new NumberParser(options);

      parser.isEnumItem = true;

      parser.parse();

    expect(parser.kind).toBe('radio');
  });

  it('parser.type should have equal to `number` number schema', () => {
    expect(parser.type).toBe('number');
  });

  it('parser.type should be equal to `radio` for enum field', () => {
    const options: ParserOptions<number, ScalarDescriptor> = {
        schema: { type: 'number' },
        model: 1,
        descriptorConstructor: NativeDescriptor.get
      };

      const parser: any = new NumberParser(options);

      parser.isEnumItem = true;

      parser.parse();

    expect(parser.type).toBe('radio');
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

  it('field.input.attrs.step should be equal to schema.multipleOf', () => {
    expect(parser.field.input.attrs.step).toBe(options.schema.multipleOf);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.input.value).toBe(2.0);
  });

  it('this.field.input.attrs.value should be equal to field.value', () => {
    expect(parser.field.input.attrs.value).toBe('2');
  });

  it('should successfully parse default number value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'number' },
      model: 3.1,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new NumberParser(options);

    parser.parse();

    expect(parser.field.input.value).toBe(3.1);
  });

  it('field.value should parse default non number value as an undefined model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'number' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new NumberParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
  });

  describe('exclusiveMinimum/exclusiveMaximum', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'number',
        exclusiveMinimum: 0,
        exclusiveMaximum: 10
      },
      model: 0,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new NumberParser(options);

    parser.parse();

    it('field.input.attrs.min should equal define using schema.exclusiveMinimum', () => {
      expect(parser.field.input.attrs.min).toBe(0.1);
    });

    it('field.input.attrs.max should equal define using schema.exclusiveMaximum', () => {
      expect(parser.field.input.attrs.max).toBe(9.9);
    });
  });
});
