import { AbstractParser } from '@/parsers/AbstractParser';
import { IntegerParser } from '@/parsers/IntegerParser';
import { ScalarDescriptor, AbstractParserOptions } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';

describe('parsers/IntegerParser', () => {
  const options: AbstractParserOptions<any, ScalarDescriptor> = {
    schema: {
      type: 'integer',
      minimum: 0,
      maximum: 10,
      multipleOf: 2
    },
    model: 2,
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new IntegerParser(options);

  parser.parse();

  it('parser should be an instance of AbstractParser', () => {
    expect(parser).toBeInstanceOf(AbstractParser);
  });

  it('parser.kind should have equal to `integer` for integer schema', () => {
    expect(parser.kind).toBe('integer');
  });

  it('parser.kind should be equal to `radio` for enum field', () => {
    const options: AbstractParserOptions<number, ScalarDescriptor> = {
        schema: { type: 'integer' },
        model: 1,
        descriptorConstructor: NativeDescriptor.get
      };

      const parser: any = new IntegerParser(options);

      parser.isEnumItem = true;

      parser.parse();

    expect(parser.kind).toBe('radio');
  });

  it('parser.type should have equal to `number` integer schema', () => {
    expect(parser.type).toBe('number');
  });

  it('field.attrs.input.type should be equal to parser.type', () => {
    expect(parser.field.attrs.input.type).toBe(parser.type);
  });

  it('field.attrs.input.min should be equal to schema.minimum', () => {
    expect(parser.field.attrs.input.min).toBe(options.schema.minimum);
  });

  it('field.attrs.input.max should be equal to schema.maximum', () => {
    expect(parser.field.attrs.input.max).toBe(options.schema.maximum);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.value).toBe(2);
  });

  it('this.field.attrs.input.value should be equal to field.value', () => {
    expect(parser.field.attrs.input.value).toBe('2');
  });

  it('should successfully parse default integer value', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'integer' },
      model: 3,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new IntegerParser(options);

    parser.parse();

    expect(parser.field.value).toBe(3);
  });

  it('field.value should parse default non integer value as an undefined model', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'integer' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new IntegerParser(options);

    parser.parse();

    expect(parser.field.value).toBeUndefined();
  });

  describe('exclusiveMinimum/exclusiveMaximum', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'integer',
        exclusiveMinimum: 0,
        exclusiveMaximum: 10
      },
      model: 0,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new IntegerParser(options);

    parser.parse();

    it('field.attrs.input.min should equal define using schema.exclusiveMinimum', () => {
      expect(parser.field.attrs.input.min).toBe(1);
    });

    it('field.attrs.input.max should equal define using schema.exclusiveMaximum', () => {
      expect(parser.field.attrs.input.max).toBe(9);
    });
  });
});
