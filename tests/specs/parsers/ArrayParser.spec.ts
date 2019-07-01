import { AbstractParser } from '@/parsers/AbstractParser';
import { ArrayParser } from '@/parsers/ArrayParser';
import { ArrayDescriptor, AbstractParserOptions } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';

describe('parsers/ArrayParser', () => {
  const options: AbstractParserOptions<unknown[], ArrayDescriptor> = {
    schema: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 3,
      uniqueItems: true
    },
    model: ['jon'],
    descriptorConstructor: NativeDescriptor.get,
    $forceUpdate: () => {}
  };

  const parser = new ArrayParser(options);

  parser.parse();

  it('parser should be an instance of AbstractParser', () => {
    expect(parser).toBeInstanceOf(AbstractParser);
  });

  it('parser.kind should have equal to `array`', () => {
    expect(parser.kind).toBe('array');
  });

  it('field.uniqueItems should be undefined for non enum schema.items even if schema.uniqueItems is defined', () => {
    expect(parser.field.uniqueItems).toBeUndefined();
  });

  it('field.minItems should be equal to schema.minItems', () => {
    expect(parser.field.minItems).toBe(options.schema.minItems);
  });

  it('field.maxItems should be equal to schema.maxItems', () => {
    expect(parser.field.maxItems).toBe(options.schema.maxItems);
  });

  it('field.max should be equal to schema.maxItems', () => {
    expect(parser.field.max).toBe(options.schema.maxItems);
  });

  it('field.max should be equal to `parser.items.length + parser.additionalItems.length` when schema.maxItems is missing and schema.items is an array', () => {
    const options: AbstractParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: [{ type: 'string' }],
        additionalItems: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.max).toBe(2);
  });

  it('field.max should be equal to `-1` when schema.maxItems is missing and schema.items is an object', () => {
    const options: AbstractParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' },
        additionalItems: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.max).toBe(-1);
  });

  it('field.count should be equal to options.model.length', () => {
    expect(parser.field.count).toBe(options.model.length);
  });

  it('field.children should be defined', () => {
    const models = parser.field.children.map(({ model }) => model);

    expect(models).toEqual(['jon']);
  });

  it('field.model should be equal to the default value', () => {
    expect(parser.field.model).toEqual(['jon']);
  });

  it('should successfully parse default value', () => {
    const options: AbstractParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' },
        default: ['arya']
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.model).toEqual(['arya']);
  });

  it('should successfully parse default schema value', () => {
    const options: AbstractParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string', default: 'tyrion' },
        minItems: 1
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser: any = new ArrayParser(options);

    parser.parse();

    expect(parser.field.model).toEqual(['tyrion']);
  });

  it('field.model should parse default undefined as an empty array', () => {
    const options: AbstractParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.model).toEqual([]);
  });

  it('field.model should parse default undefined as an empty array', () => {
    const options: AbstractParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.model).toEqual([]);
  });

  it('field.children should be equal to an empty array with missing schema.items', () => {
    const options: AbstractParserOptions<any, ArrayDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.model).toEqual([]);
  });
});
