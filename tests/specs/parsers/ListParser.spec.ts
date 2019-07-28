import { Parser } from '@/parsers/Parser';
import { ListParser } from '@/parsers/ListParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';

describe('parsers/ListParser', () => {
  const options: ParserOptions<unknown, ScalarDescriptor> = {
    schema: {
      type: 'string',
      enum: ['jon', 'arya']
    },
    model:'arya',
    descriptorConstructor: new NativeDescriptor(NativeElements)
  };

  const parser = new ListParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `list`', () => {
    expect(parser.kind).toBe('list');
  });

  it('parser.items should be defined', () => {
    expect(parser.items).toEqual([
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
    ]);
  });

  it('field.items should be equal to parser.items', () => {
    expect(parser.field.items).toEqual(parser.items);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.input.value).toEqual('arya');
  });

  it('should successfully parse default value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'string',
        enum: ['jon', 'arya'],
        default: 'jon'
      },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ListParser(options);

    parser.parse();

    expect(parser.field.input.value).toBe('jon');
  });

  it('field.value should parse default undefined as an undefined model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', enum: ['jon', 'arya'] },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ListParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
  });

  it('field.items should be equal to an empty array with missing schema.enum', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ListParser(options);

    parser.parse();

    expect(parser.field.items).toEqual([]);
  });

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
