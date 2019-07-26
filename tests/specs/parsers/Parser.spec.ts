import { Component } from 'vue';
import { Parser } from '@/parsers/Parser';
import { Dictionary, ScalarDescriptor, StringField, ParserOptions, ObjectDescriptor } from '@/types';
import { Objects } from '@/lib/Objects';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { JsonSchema } from '@/types/jsonschema';
import { TestParser } from '../../lib/TestParser';

class FakeParser extends Parser<any, StringField, ScalarDescriptor> {
  parse() {}
}

class ObjectFakeParser extends Parser<string, StringField, ScalarDescriptor> {
  get type(): string {
    return 'object';
  }

  parseValue(data: any): any {
    return data || {};
  }

  parse() {}
}

class InputFakeParser extends Parser<string, StringField, ScalarDescriptor> {
  get type(): string {
    return 'text';
  }

  parseValue(data: any): string {
    return data;
  }

  parse() {}
}

function descriptorConstructorFaker({ type }: JsonSchema) {
  return type === 'object' ? {} : { kind: type };
}

const ParserValidator = {
  isRoot: true,
  isEnumItem: false,
  parent: undefined,
  root: (value: FakeParser, parser: FakeParser) => expect(value).toBe(parser),
  options: (value: ParserOptions<any, ScalarDescriptor>) => {
    expect(typeof value).toBe('object');
    expect(value).not.toBeNull();
  },
  schema: (value: JsonSchema, { options }: FakeParser) => expect(value).toBe(options.schema),
  model: (value: any, { initialValue }: FakeParser) => expect(value).toBe(initialValue),
  rawValue: (value: any, { initialValue }: FakeParser) => expect(value).toBe(initialValue),
  descriptor: (value: any) => expect(value).toBeDefined(),
  kind: (value: string, { schema }: FakeParser) => expect(value).toBe(schema.type),
  id: (value: string) => expect(typeof value).toBe('string'),
  initialValue: (value: any, { options, schema }: FakeParser) => [schema.default, options.model].includes(value),
  field: {
    kind: (value: string, parser: FakeParser) => expect(value).toBe(parser.kind),
    name: (value: string, parser: FakeParser) => expect(value).toBe(parser.options.name),
    isRoot: (value: boolean, parser: FakeParser) => expect(value).toBe(parser.isRoot),
    schema: (value: JsonSchema, { options }: FakeParser) => expect(value).toBe(options.schema),
    required: (value: boolean, parser: FakeParser) => expect(value).toBe(parser.options.required || false),
    descriptor: (value: Dictionary, parser: FakeParser) => expect(value).toEqual(parser.descriptor),
    parent: (value: any, parser: FakeParser) => parser.parent ? expect(value).toBe(parser.parent.field) : expect(value).toBeUndefined(),
    deep: (value: number, parser: FakeParser) => parser.field.parent ? expect(value).toBe(parser.field.parent.deep + 1) : expect(value).toBe(0),
    input: {
      attrs: {
        id: (value: string, parser: FakeParser) => expect(value).toBe(parser.id),
        type: (value: string, parser: FakeParser) => expect(value).toBe(parser.type),
        name: (value: string, { options }: FakeParser) => expect(value).toBe(options.name),
        readonly: (value: boolean, { schema }: FakeParser) => expect(value).toBe(schema.readOnly),
        required: (value: boolean, { field }: FakeParser) => expect(value).toBe(field.required),
        'aria-required': (value: string | undefined, { field }: FakeParser) => expect(value).toBe(field.required ? 'true' : undefined),
        'aria-labelledby': (value: string | undefined, { field }: FakeParser) => expect(value).toBe(field.label.attrs.id),
        'aria-describedby': (value: string | undefined, { field }: FakeParser) => expect(value).toBe(field.helper.attrs.id)
      },
      props: (value: Dictionary, parser: FakeParser) => expect(value).toEqual(parser.descriptor.props),
      value: (value: any, parser: FakeParser) => expect(value).toBe(parser.model),
      component: (value: Dictionary) => expect(value).toBeDefined()
    },
    label: {
      attrs: {
        id: (value: string | undefined) => typeof value === 'undefined' || expect(value.endsWith('-label')).toBeTruthy(),
        for: (value: string, parser: FakeParser) => expect(value).toBe(parser.attrs.id)
      },
      value: (value: string, parser: FakeParser) => expect(value).toBe(parser.descriptor.label)
    },
    helper: {
      attrs: {
        id: (value: string | undefined) => typeof value === 'undefined' || expect(value.endsWith('-helper')).toBeTruthy()
      },
      value: (value: string, parser: FakeParser) => expect(value).toBe(parser.descriptor.helper)
    }
  }
};

describe('parsers/Parser', () => {
  describe('register and get', () => {
    it('Parser.get() should return `null` for undefined schema.type', () => {
      const options: any = {
        schema: { type: undefined } as any
      };

      const parser = Parser.get(options);

      expect(parser).toBe(null);
    });

    it('Parser.get() should throw an exception for unregister type', () => {
      const options: any = {
        schema: { type: 'unknow' } as any
      };

      expect(() => Parser.get(options)).toThrowError(TypeError);
    });

    it('Parser.get() should successfully return the registered parser', () => {
      const options: any = {
        schema: { type: 'string' },
        descriptorConstructor: descriptorConstructorFaker
      };

      Parser.register('string', InputFakeParser);
      expect(Parser.get(options)).toBeInstanceOf(InputFakeParser);
    });

    it('Parser.get() should successfully return the registered parser with its parent', () => {
      Parser.register('object', ObjectFakeParser);
      Parser.register('string', InputFakeParser);

      const schema: JsonSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      };

      const options: any = {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        },
        descriptorConstructor: descriptorConstructorFaker
      };

      const childOptions: any = {
        schema: options.schema.properties.name,
        descriptorConstructor: descriptorConstructorFaker
      };

      const parent: any = Parser.get(options);
      const child: any = Parser.get(childOptions, parent);

      expect(child).toBeInstanceOf(InputFakeParser);
      expect(child.parent).toBeInstanceOf(ObjectFakeParser);
    });
  });

  const options10: any = {
    schema: { type: 'string' },
    model: '',
    descriptorConstructor: NativeDescriptor.get
  };

  TestParser.Case({
    case: '1.0',
    parser: new FakeParser(options10),
    expected: ParserValidator
  });

  TestParser.Case({
    case: '1.1',
    parser: new FakeParser({
      schema: { type: 'string', default: 'Hello' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: ParserValidator
  });

  TestParser.Case({
    case: '1.2',
    description: 'with options.required === true',
    parser: new FakeParser({
      schema: { type: 'string' },
      model: undefined,
      required: true,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: ParserValidator
  });

  TestParser.Case({
    case: '1.3.0',
    description: 'field.input.setValue() without options.onChange',
    parser: () => {
      const parser = new FakeParser(options10);

      parser.parse();
      parser.field.input.setValue('arya');

      return parser;
    },
    expected: {
      model: 'arya',
      rawValue: 'arya'
    }
  });

  TestParser.Case({
    case: '1.3.1',
    description: 'field.input.setValue() with options.onChange (commit)',
    parser: () => {
      const onChange = jest.fn();
      const parser = new FakeParser({ ...options10, onChange });

      parser.parse();
      parser.field.input.setValue('jon');

      return parser;
    },
    expected: {
      model: 'jon',
      rawValue: 'jon',
      options: {
        onChange: (onChange: any) => expect(onChange.mock.calls.length).toBe(1)
      }
    }
  });

  TestParser.Case({
    case: '2',
    description: 'schema with title and description',
    parser: new FakeParser({
      schema: { type: 'string', title: 'Name', description: 'Your First Name' },
      model: '',
      id: 'input-id',
      descriptor: {
        kind: 'string',
        attrs: {},
        props: {},
        component: {
          name: 'TextInput'
        }
      },
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: ParserValidator
  });

  TestParser.Case({
    case: '3',
    description: 'with missing descriptor.kind',
    parser: () => {
      const parser = new FakeParser({
        schema: { type: 'string' },
        model: undefined,
        descriptor: {
          attrs: {},
          props: {},
          items: {}
        },
        descriptorConstructor: NativeDescriptor.get
      });

      delete parser.field.descriptor.kind;

      return parser;
    },
    expected: {
      defaultComponent: undefined
    }
  });

  TestParser.Case({
    case: '4.0',
    description: 'parser.requestRender()',
    parser: () => {
      const requestRender = jest.fn();
      const parser = new FakeParser({ ...options10, requestRender });

      parser.parse();
      parser.requestRender([parser.field]);

      return parser;
    },
    expected: {
      options: {
        requestRender: (requestRender: any) => expect(requestRender.mock.calls.length).toBe(1)
      }
    }
  });

  TestParser.Case({
    case: '4.1',
    description: 'parser.requestRender() with options.requestRender as non function',
    parser: () => {
      const requestRender = { x: jest.fn() };
      const parser = new FakeParser({ ...options10, requestRender });

      parser.parse();
      parser.requestRender([parser.field]);

      return parser;
    },
    expected: {
      options: (options: any) => expect(options.requestRender.x.mock.calls.length).toBe(0)
    }
  });

  TestParser.Case({
    case: '5.0',
    description: 'parser.reset()',
    parser: () => {
      const model = 'arya';
      const onChange = jest.fn();
      const parser = new FakeParser({ ...options10, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        expect(parser.rawValue).toBe('arya');
        expect(parser.model).toBe('arya');

        parser.field.input.setValue('jon');

        expect(parser.rawValue).toBe('jon');
        expect(parser.model).toBe('jon');

        parser.reset();

        expect(parser.rawValue).toBe('arya');
        expect(parser.model).toBe('arya');

        parser.field.input.reset();

        expect(parser.options.onChange.mock.calls.map(([value]: any) => value)).toEqual(['jon', 'arya']);
      }
    }
  });
});
