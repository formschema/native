import { Parser } from '@/parsers/Parser';
import { EnumParser } from '@/parsers/EnumParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { TestParser } from '../../lib/TestParser';

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
    const models = parser.field.children.map(({ input }) => input.value);

    expect(models).toEqual(['jon', 'arya', 'bran', 'ned']);
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.input.value).toBe('jon');
  });

  it('field.input.attrs.checked should be defined', () => {
    const checkStates = parser.field.children.map(({ input }) => input.attrs.checked);

    expect(checkStates).toEqual([true, false, false, false]);
  });

  it('field.value should be equal to the updated value using field.input.setValue()', () => {
    parser.field.input.setValue('arya');
    expect(parser.field.input.value).toBe('arya');
  });

  it('field.input.attrs.checked should be updated when using field.input.setValue()', () => {
    parser.field.input.setValue('bran');

    const checkStates = parser.field.children.map(({ input }) => input.attrs.checked);

    expect(checkStates).toEqual([false, false, true, false]);
  });

  it('field.value should be updated when a child is checked', () => {
    const childField: any = parser.field.children.slice(-1).pop();

    childField.input.setValue(childField.input.value);
    expect(parser.field.input.value).toBe('ned');
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

    expect(parser.field.input.value).toBe('arya');
  });

  it('field.value should parse default undefined as an undefined model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string', enum: ['jon', 'arya'] },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new EnumParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
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

    expect(parser.field.input.component.name).toBe('ListElement');
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

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    parser: () => {
      const model = 'arya';
      const onChange = jest.fn();
      const parser = new EnumParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        const onChange = parser.options.onChange;
        const expected = [
          'arya',
          'jon'
        ];

        expect(parser.rawValue).toEqual('arya');
        expect(parser.model).toEqual('arya');
        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

        parser.field.children[0].input.setValue(true);

        expect(onChange.mock.calls.length).toBe(2);
        expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
        expect(parser.rawValue).toEqual('jon');
        expect(parser.model).toEqual('jon');

        parser.reset(); // reset without calling onChange

        expect(onChange.mock.calls.length).toBe(2);
        expect(parser.initialValue).toEqual('arya');
        expect(parser.rawValue).toEqual('arya');
        expect(parser.model).toEqual('arya');

        parser.field.input.reset(); // reset with calling onChange

        expect(onChange.mock.calls.length).toBe(3);
        expect(onChange.mock.calls[2][0]).toEqual(expected[0]);
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.clear()',
    parser: () => {
      const model = 'arya';
      const onChange = jest.fn();
      const parser = new EnumParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      clear(fn: Function, parser: any) {
        const onChange = parser.options.onChange;

        expect(parser.rawValue).toEqual('arya');
        expect(parser.model).toEqual('arya');
        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toEqual('arya');

        parser.field.children[0].input.setValue(true);

        expect(onChange.mock.calls.length).toBe(2);
        expect(onChange.mock.calls[1][0]).toEqual('jon');
        expect(parser.rawValue).toEqual('jon');
        expect(parser.model).toEqual('jon');

        parser.clear(); // clear without calling onChange

        expect(onChange.mock.calls.length).toBe(2);
        expect(parser.rawValue).toEqual(undefined);
        expect(parser.model).toEqual(undefined);

        parser.field.input.clear(); // clear with calling onChange

        expect(onChange.mock.calls.length).toBe(3);
        expect(onChange.mock.calls[2][0]).toEqual(undefined);
      }
    }
  });
});
