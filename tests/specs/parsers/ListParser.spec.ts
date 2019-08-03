import { Parser } from '@/parsers/Parser';
import { ListParser } from '@/parsers/ListParser';
import { ScalarDescriptor, ParserOptions, ListItem } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';
import { TestParser } from '../../lib/TestParser';

describe('parsers/ListParser', () => {
  TestParser.Case({
    case: '1.0',
    description: 'parseItem() with a string schema',
    parser: new ListParser({
      schema: {
        type: 'string',
        enum: ['jon', 'arya']
      },
      model: 'arya',
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      kind: (value: string) => expect(value).toBe('list'),
      items: (values: ListItem[]) => expect(values).toEqual([
        {
          value: 'jon',
          selected: false,
          label: 'jon'
        },
        {
          value: 'arya',
          selected: true,
          label: 'arya'
        }
      ]),
      field: {
        items: (values: ListItem[], parser: any) => expect(values).toEqual(parser.items),
        input: {
          value: (value: string) => expect(value).toBe('arya')
        }
      }
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'parseItem() with a boolean schema',
    parser: new ListParser({
      schema: {
        type: 'boolean',
        enum: [true, false]
      },
      model: true,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      items: (values: ListItem[]) => expect(values).toEqual([
        {
          value: 'true',
          selected: true,
          label: 'true'
        },
        {
          value: 'false',
          selected: false,
          label: 'false'
        }
      ]),
      field: {
        input: {
          value: (value: string) => expect(value).toBe(true)
        }
      }
    }
  });

  TestParser.Case({
    case: '1.2',
    description: 'parseItem() with a null schema',
    parser: new ListParser({
      schema: {
        type: 'null',
        enum: [null, null]
      },
      model: null,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      items: (values: ListItem[]) => expect(values).toEqual([
        {
          value: 'null',
          selected: true,
          label: 'null'
        },
        {
          value: 'null',
          selected: true,
          label: 'null'
        }
      ]),
      field: {
        input: {
          value: (value: string) => expect(value).toBe(null)
        }
      }
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'field.items should be empty with missing schema.enum',
    parser: new ListParser({
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      field: {
        items: (values: ListItem[]) => expect(values).toEqual([])
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parseValue(data) with truthy boolean',
    parser: new ListParser({
      schema: { type: 'boolean' },
      model: 'true',
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      model: (value: unknown) => expect(value).toBe(true)
    }
  });

  TestParser.Case({
    case: '2.1',
    description: 'parseValue(data) with falsy boolean',
    parser: new ListParser({
      schema: { type: 'boolean' },
      model: 'false',
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      model: (value: unknown) => expect(value).toBe(false)
    }
  });

  TestParser.Case({
    case: '2.2',
    description: 'parseValue(data) with invalid boolean',
    parser: new ListParser({
      schema: { type: 'boolean' },
      model: 'invalid boolean value',
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      model: (value: unknown) => expect(value).toBe(false)
    }
  });

  TestParser.Case({
    case: '2.3',
    description: 'parseValue(data) with integer',
    parser: new ListParser({
      schema: { type: 'integer' },
      model: '12',
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      model: (value: unknown) => expect(value).toBe(12)
    }
  });

  TestParser.Case({
    case: '2.4',
    description: 'parseValue(data) with number',
    parser: new ListParser({
      schema: { type: 'number' },
      model: '12.2',
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      model: (value: unknown) => expect(value).toBe(12.2)
    }
  });

  TestParser.Case({
    case: '2.5',
    description: 'parseValue(data) with unknown schema type',
    parser: new ListParser({
      schema: { type: 'unknown' } as any,
      model: '12.5',
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      model: (value: unknown) => expect(value).toBe('12.5')
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'should successfully parse default value',
    parser: new ListParser({
      schema: {
        type: 'string',
        enum: ['jon', 'arya'],
        default: 'jon'
      },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      model: (value: unknown) => expect(value).toBe('jon')
    }
  });

  TestParser.Case({
    case: '3.1',
    description: 'field.value should parse default undefined as an undefined model',
    parser: new ListParser({
      schema: { type: 'string', enum: ['jon', 'arya'] },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      field: {
        input: {
          value: (value: unknown) => expect(value).toBeUndefined()
        }
      }
    }
  });

  describe('descriptor', () => {
    it('field.items should be defined with provided field.descriptor.items', () => {
      const options: ParserOptions<any, ScalarDescriptor> = {
        schema: {
          type: 'string',
          enum: ['jon', 'arya']
        },
        model: undefined,
        descriptorConstructor: new NativeDescriptor(NativeElements)
      };

      const parser = new ListParser(options);

      parser.field.descriptor.items = {
        jon: { label: 'Jon Snow' },
        arya: { label: 'Arya Stark' }
      }

      parser.parse();

      expect(parser.field.items).toEqual([
        {
          value: 'jon',
          selected: false,
          label: 'Jon Snow'
        },
        {
          value: 'arya',
          selected: false,
          label: 'Arya Stark'
        }
      ]);
    });

    it('field.items should be defined with missing field.descriptor.items', () => {
      const options: ParserOptions<any, ScalarDescriptor> = {
        schema: {
          type: 'string',
          enum: ['jon', 'arya']
        },
        model: undefined,
        descriptorConstructor: new NativeDescriptor(NativeElements)
      };

      const parser = new ListParser(options);

      delete parser.field.descriptor.items;

      parser.parse();

      expect(parser.field.items).toEqual([
        {
          value: 'jon',
          selected: false,
          label: 'jon'
        },
        {
          value: 'arya',
          selected: false,
          label: 'arya'
        }
      ]);
    });

    it('with missing options.descriptor.component', () => {
      const options: ParserOptions<any, ScalarDescriptor> = {
        schema: { type: 'string' },
        model: undefined,
        descriptor: {
          kind: 'enum',
          attrs: {},
          props: {},
          items: {}
        },
        descriptorConstructor: new NativeDescriptor(NativeElements)
      };

      const parser: any = new ListParser(options);

      expect(parser.field.input.component.name).toBe('FieldsetElement');
    });

    it('with missing options.descriptor.component and options.descriptor.kind', () => {
      const options: ParserOptions<any, ScalarDescriptor> = {
        schema: { type: 'string' },
        model: undefined,
        descriptor: {
          attrs: {},
          props: {},
          items: {}
        },
        descriptorConstructor: new NativeDescriptor(NativeElements)
      };

      const parser: any = new ListParser(options);

      delete parser.descriptor.kind;

      expect(parser.defaultComponent.name).toBe('ListElement');
    });
  });
});
