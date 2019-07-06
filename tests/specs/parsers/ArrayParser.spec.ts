import { Parser } from '@/parsers/Parser';
import { ArrayParser } from '@/parsers/ArrayParser';
import { ArrayDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import '@/parsers';

describe('parsers/ArrayParser', () => {
  const options: ParserOptions<unknown[], ArrayDescriptor> = {
    schema: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 3,
      uniqueItems: true
    },
    model: ['jon'],
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new ArrayParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `array`', () => {
    expect(parser.kind).toBe('array');
  });

  it('field.uniqueItems should be undefined for non enum schema.items even if schema.uniqueItems is defined', () => {
    expect(parser.field.uniqueItems).toBeUndefined();
  });

  it('parser.minItems should be equal to schema.minItems', () => {
    expect(parser.minItems).toBe(options.schema.minItems);
  });

  it('parser.maxItems should be equal to schema.maxItems', () => {
    expect(parser.maxItems).toBe(options.schema.maxItems);
  });

  it('parser.max should be equal to schema.maxItems', () => {
    expect(parser.max).toBe(options.schema.maxItems);
  });

  it('parser.max should be equal to `-1` when schema.maxItems is missing and schema.items is an array with empty schema.additionalItems', () => {
    const options: ParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: [{ type: 'string' }],
        additionalItems: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.max).toBe(-1);
  });

  it('parser.max should be equal to `-2` when schema.maxItems is missing and schema.items is an object', () => {
    const options: ParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' },
        additionalItems: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.max).toBe(-2);
  });

  it('field.children.length should be equal to options.model.length', () => {
    expect(parser.field.children.length).toBe(options.model.length);
  });

  it('field.children should be defined', () => {
    const models = parser.field.children.map(({ value: model }) => model);

    expect(models).toEqual(['jon']);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.value).toEqual(['jon']);
  });

  it('should successfully parse default value', () => {
    const options: ParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' },
        default: ['arya']
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.value).toEqual(['arya']);
  });

  it('should successfully parse default schema value', () => {
    const options: ParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string', default: 'tyrion' },
        minItems: 1
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new ArrayParser(options);

    parser.parse();

    expect(parser.field.value).toEqual(['tyrion']);
  });

  it('field.value should parse default undefined as an empty array', () => {
    const options: ParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.value).toEqual([]);
  });

  it('field.value should parse default undefined as an empty array', () => {
    const options: ParserOptions<any, ArrayDescriptor> = {
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.value).toEqual([]);
  });

  it('field.children should be equal to an empty array with missing schema.items', () => {
    const options: ParserOptions<any, ArrayDescriptor> = {
      schema: { type: 'array' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ArrayParser(options);

    parser.parse();

    expect(parser.field.value.length).toBe(0);
  });
});
