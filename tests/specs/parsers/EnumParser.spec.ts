import { AbstractParser } from '@/parsers/AbstractParser';
import { EnumParser } from '@/parsers/EnumParser';
import { ScalarDescriptor, AbstractParserOptions } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';

describe('parsers/EnumParser', () => {
  const options: AbstractParserOptions<unknown, ScalarDescriptor> = {
    schema: {
      type: 'string',
      enum: ['jon', 'arya']
    },
    model: 'jon',
    descriptorConstructor: NativeDescriptor.get,
    $forceUpdate: () => {}
  };

  const parser = new EnumParser(options);

  parser.parse();

  it('parser should be an instance of AbstractParser', () => {
    expect(parser).toBeInstanceOf(AbstractParser);
  });

  it('parser.kind should have equal to `enum`', () => {
    expect(parser.kind).toBe('enum');
  });

  it('field.children should be defined', () => {
    const models = parser.field.children.map(({ model }) => model);

    expect(models).toEqual(['jon', 'arya']);
  });

  it('field.model should be equal to the default value', () => {
    expect(parser.field.model).toBe('jon');
  });

  it('field.attrs.input.checked should be defined', () => {
    const checkStates = parser.field.children.map(({ attrs }) => attrs.input.checked);

    expect(checkStates).toEqual([true, false]);
  });

  it('should successfully parse default value', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'string',
        enum: ['jon', 'arya', 'tyrion'],
        default: 'arya'
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser: any = new EnumParser(options);

    parser.parse();

    expect(parser.field.model).toBe('arya');
  });

  it('field.model should parse default undefined as an undefined model', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', enum: ['jon', 'arya'] },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new EnumParser(options);

    parser.parse();

    expect(parser.field.model).toBeUndefined();
  });

  it('field.children should be equal to an empty array with missing schema.enum', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new EnumParser(options);

    parser.parse();

    expect(parser.field.children).toEqual([]);
  });

  it('field.children should be defined with provided field.descriptor.labels', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'string',
        enum: ['jon', 'arya']
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser = new EnumParser(options);

    parser.field.descriptor.labels = {
      jon: 'Jon Snow',
      arya: 'Arya Stark'
    }

    parser.parse();

    const models = parser.field.children.map(({ descriptor }) => descriptor.label);

    expect(models).toEqual(['Jon Snow', 'Arya Stark']);
  });

  it('with missing options.descriptor.component', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptor: {
        kind: 'list',
        attrs: {},
        props: {},
        labels: {}
      },
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser: any = new EnumParser(options);

    expect(parser.field.component.name).toBe('ListElement');
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
      descriptorConstructor: NativeDescriptor.get,
      $forceUpdate: () => {}
    };

    const parser: any = new EnumParser(options);

    delete parser.descriptor.kind;

    expect(parser.defaultComponent.name).toBe('FieldsetElement');
  });
});
