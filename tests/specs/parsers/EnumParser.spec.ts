import { Parser } from '@/parsers/Parser';
import { EnumParser } from '@/parsers/EnumParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import '@/parsers';

describe('parsers/EnumParser', () => {
  const options: ParserOptions<unknown, ScalarDescriptor> = {
    schema: {
      type: 'string',
      enum: ['jon', 'arya', 'bran', 'ned']
    },
    model: 'jon',
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new EnumParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `enum`', () => {
    expect(parser.kind).toBe('enum');
  });

  it('field.children should be defined', () => {
    const models = parser.field.children.map(({ value: model }) => model);

    expect(models).toEqual(['jon', 'arya', 'bran', 'ned']);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.value).toBe('jon');
  });

  it('field.attrs.input.checked should be defined', () => {
    const checkStates = parser.field.children.map(({ attrs }) => attrs.input.checked);

    expect(checkStates).toEqual([true, false, false, false]);
  });

  it('field.value should be equal to the updated value using field.setValue()', () => {
    parser.field.setValue('arya');
    expect(parser.field.value).toBe('arya');
  });

  it('field.attrs.input.checked should be updated when using field.setValue()', () => {
    parser.field.setValue('bran');

    const checkStates = parser.field.children.map(({ attrs }) => attrs.input.checked);

    expect(checkStates).toEqual([false, false, true, false]);
  });

  it('field.value should be updated when a child is checked', () => {
    const childField: any = parser.field.children.slice(-1).pop();

    childField.setValue(childField.value);
    expect(parser.field.value).toBe('ned');
  });

  it('should successfully parse default value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'string',
        enum: ['jon', 'arya', 'tyrion'],
        default: 'arya'
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new EnumParser(options);

    parser.parse();

    expect(parser.field.value).toBe('arya');
  });

  it('field.value should parse default undefined as an undefined model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', enum: ['jon', 'arya'] },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new EnumParser(options);

    parser.parse();

    expect(parser.field.value).toBeUndefined();
  });

  it('field.children should be equal to an empty array with missing schema.enum', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new EnumParser(options);

    parser.parse();

    expect(parser.field.children).toEqual([]);
  });

  it('field.children should be defined with provided field.descriptor.items', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'string',
        enum: ['jon', 'arya']
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new EnumParser(options);

    parser.field.descriptor.items = {
      jon: {
        label: 'Jon Snow'
      },
      arya: {
        label: 'Arya Stark'
      }
    }

    parser.parse();

    const models = parser.field.children.map(({ descriptor }) => descriptor.label);

    expect(models).toEqual(['Jon Snow', 'Arya Stark']);
  });

  it('with missing options.descriptor.component', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptor: {
        kind: 'list',
        attrs: {},
        props: {},
        items: {}
      },
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new EnumParser(options);

    expect(parser.field.component.name).toBe('ListElement');
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
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new EnumParser(options);

    delete parser.descriptor.kind;

    expect(parser.defaultComponent.name).toBe('FieldsetElement');
  });
});
