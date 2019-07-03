import { AbstractParser } from '@/parsers/AbstractParser';
import { ListParser } from '@/parsers/ListParser';
import { ScalarDescriptor, AbstractParserOptions } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';

describe('parsers/ListParser', () => {
  const options: AbstractParserOptions<unknown, ScalarDescriptor> = {
    schema: {
      type: 'string',
      enum: ['jon', 'arya']
    },
    model:'arya',
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new ListParser(options);

  parser.parse();

  it('parser should be an instance of AbstractParser', () => {
    expect(parser).toBeInstanceOf(AbstractParser);
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

  it('field.model should be equal to the default value', () => {
    expect(parser.field.model).toEqual('arya');
  });

  it('should successfully parse default value', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'string',
        enum: ['jon', 'arya'],
        default: 'jon'
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ListParser(options);

    parser.parse();

    expect(parser.field.model).toBe('jon');
  });

  it('field.model should parse default undefined as an undefined model', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', enum: ['jon', 'arya'] },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ListParser(options);

    parser.parse();

    expect(parser.field.model).toBeUndefined();
  });

  it('field.items should be equal to an empty array with missing schema.enum', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ListParser(options);

    parser.parse();

    expect(parser.field.items).toEqual([]);
  });

  it('field.items should be defined with provided field.descriptor.labels', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'string',
        enum: ['jon', 'arya']
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new ListParser(options);

    parser.field.descriptor.labels = {
      jon: 'Jon Snow',
      arya: 'Arya Stark'
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

  it('with missing options.descriptor.component', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptor: {
        kind: 'enum',
        attrs: {},
        props: {},
        labels: {}
      },
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new ListParser(options);

    expect(parser.field.component.name).toBe('FieldsetElement');
  });

  it('with missing options.descriptor.component and options.descriptor.kind', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptor: {
        attrs: {},
        props: {},
        labels: {}
      },
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new ListParser(options);

    delete parser.descriptor.kind;

    expect(parser.defaultComponent.name).toBe('ListElement');
  });
});
