import { Parser } from '@/parsers/Parser';
import { ObjectParser } from '@/parsers/ObjectParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import '@/parsers';

describe('parsers/ObjectParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    },
    model: { name: 'Jon Snow' },
    name: 'profile',
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new ObjectParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `object`', () => {
    expect(parser.kind).toBe('object');
  });

  it('parser.required should have equal to schema.required', () => {
    expect(parser.required).toEqual(options.schema.required);
  });

  it('parser.children should be defined', () => {
    expect(parser.children.length).toBe(1);
  });

  it('field.attrs.input.required should be undefined', () => {
    expect(parser.field.attrs.input.required).toBeUndefined();
  });

  it('field.attrs.input.aria-required should be undefined', () => {
    expect(parser.field.attrs.input['aria-required']).toBeUndefined();
  });

  it('field.attrs.input.name should be undefined', () => {
    expect(parser.field.attrs.input.name).toBeUndefined();
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.value).toEqual({ name: 'Jon Snow' });
  });

  it('should successfully parse default object value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        default: {
          name: 'Arya Stark'
        }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    parser.parse();

    expect(parser.field.value).toEqual({
      name: 'Arya Stark'
    });
  });

  it('field.value should parse default non object value as an empty model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'object' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    parser.parse();

    expect(parser.field.value).toEqual({});
  });

  describe('schema with empty schema.properties', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {}
      },
      model: {},
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('parser.required should have equal to an empty array for missing schema.required', () => {
      expect(parser.required).toEqual([]);
    });

    it('parser.propertiesList should have equal to an empty array', () => {
      expect(parser.propertiesList).toEqual([]);
    });
  });

  describe('schema with empty model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      },
      model: {},
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.value should be equal to an empty object', () => {
      expect(parser.field.value).toEqual({ name: undefined });
    });
  });

  describe('schema with a defined schema.default', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', default: 'Goku' }
        },
        required: ['name']
      },
      model: {},
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.value should be equal to the default defined object', () => {
      expect(parser.field.value).toEqual({ name: 'Goku' });
    });
  });

  describe('with field.descriptor.order', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          dateBirth: { type: 'string' }
        }
      },
      model: {},
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    parser.field.descriptor.order = ['lastName', 'dateBirth'];

    parser.parse();

    it('parser.propertiesList should have equal to an empty array', () => {
      expect(parser.propertiesList).toEqual(['lastName', 'dateBirth', 'firstName']);
    });
  });

  describe('with missing field.descriptor.order', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' }
        }
      },
      model: {},
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    delete parser.field.descriptor.order;

    parser.parse();

    it('parser.propertiesList should be defined', () => {
      expect(parser.propertiesList).toEqual(['firstName', 'lastName']);
    });
  });

  describe('with nested object', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' }
            }
          },
          dateBirth: { type: 'string' }
        }
      },
      model: {},
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.children.name should have a defined attrs.input.name', () => {
      expect(parser.field.children[0].attrs.input.name).toBe('name');
    });

    it('field.value should be defined as an empty object with nested properties', () => {
      expect(parser.field.value).toEqual({
        name: {
          firstName: undefined,
          lastName: undefined
        },
        dateBirth: undefined
      });
    });

    it('field.value should be updated when setting a child model', () => {
      parser.field.children[1].setValue('-8600/01/02');

      expect(parser.field.value).toEqual({
        name: {
          firstName: undefined,
          lastName: undefined
        },
        dateBirth: '-8600/01/02'
      });
    });

    it('field.value should be equal to the defined model using field.setValue()', () => {
      parser.field.setValue({
        name: {
          firstName: 'Tyrion',
          lastName: 'Lannister'
        },
        dateBirth: '-8600/01/01'
      });

      expect(parser.field.value).toEqual({
        name: {
          firstName: 'Tyrion',
          lastName: 'Lannister'
        },
        dateBirth: '-8600/01/01'
      });
    });
  });
});
