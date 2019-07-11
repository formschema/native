import { Component } from 'vue';
import { Parser } from '@/parsers/Parser';
import { Dictionary, ScalarDescriptor, StringField, ParserOptions, ObjectDescriptor } from '@/types';
import { Objects } from '@/lib/Objects';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { JsonSchema } from '@/types/jsonschema';
import { TestParser } from '../../lib/TestParser';

class FakeParser extends Parser<any, ScalarDescriptor, StringField> {}

class ObjectFakeParser extends Parser<string, ScalarDescriptor, StringField> {
  get type(): string {
    return 'object';
  }

  parseValue(data: any): any {
    return data || {};
  }
}

class InputFakeParser extends Parser<string, ScalarDescriptor, StringField> {
  get type(): string {
    return 'text';
  }

  parseValue(data: any): string {
    return data;
  }
}

function descriptorConstructorFaker({ type }: JsonSchema) {
  return type === 'object' ? {} : { kind: type };
}

const ParserValidator = {
  isRoot: true,
  isEnumItem: false,
  parent: undefined,
  root: (root: FakeParser, parser: FakeParser) => root === parser,
  options: (value: ParserOptions<any, ScalarDescriptor>) => typeof value === 'object' && value !== null,
  schema: (schema: JsonSchema, { options }: FakeParser) => schema === options.schema,
  model: (value: any, { initialValue }: FakeParser) => value === initialValue,
  rawValue: (value: any, { initialValue }: FakeParser) => value === initialValue,
  descriptor: (value: any) => typeof value !== 'undefined',
  kind: (value: string, { schema }: FakeParser) => value === schema.type,
  type: undefined,
  id: (value: string) => typeof value === 'string',
  initialValue: (value: any, { options, schema }: FakeParser) => [schema.default, options.model].includes(value),
  field: {
    kind: (value: string, parser: FakeParser) => value === parser.kind,
    name: (value: string, parser: FakeParser) => value === parser.options.name,
    isRoot: (value: boolean, parser: FakeParser) => value === parser.isRoot,
    required: (value: boolean, parser: FakeParser) => value === (parser.options.required || false),
    defaultValue: (value: any, { schema }: FakeParser) => value === schema.default,
    value: (value: any, parser: FakeParser) => value === parser.model,
    rawValue: (value: any, parser: FakeParser) => value === parser.rawValue,
    props: (value: Dictionary, parser: FakeParser) => Objects.equals(value, parser.descriptor.props),
    descriptor: (value: Dictionary, parser: FakeParser) => Objects.equals(value, parser.descriptor),
    component: (value: Dictionary) => typeof value !== 'undefined',
    parent: (value: any, parser: FakeParser) => parser.parent ? value === parser.parent.field : value === undefined,
    attrs: {
      input: {
        id: (value: string, parser: FakeParser) => value === parser.id,
        type: (value: string, parser: FakeParser) => value === parser.type,
        name: (value: string, { options }: FakeParser) => value === options.name,
        readonly: (value: boolean, { schema }: FakeParser) => value === schema.readOnly,
        required: (value: boolean, { options }: FakeParser) => value === options.required,
        'aria-required': (value: string | undefined, { field }: FakeParser) => value === (field.required ? 'true' : undefined),
        'aria-labelledby': (value: string | undefined, { field }: FakeParser) => typeof value === (field.descriptor.label ? 'string' : 'undefined'),
        'aria-describedby': (value: string | undefined, { field }: FakeParser) => typeof value === (field.descriptor.description ? 'string' : 'undefined')
      },
      label: {
        id: (value: string | undefined, { field }: FakeParser) => value === field.attrs.input['aria-labelledby'],
        for: (value: string, parser: FakeParser) => value === parser.id
      },
      description: {
        id: (value: string | undefined, { field }: FakeParser) => value === field.attrs.input['aria-describedby']
      }
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
    description: 'field.setValue() without options.onChange',
    parser: () => {
      const parser = new FakeParser(options10);

      parser.parse();
      parser.field.setValue('arya');

      return parser;
    },
    expected: {
      model: 'arya',
      rawValue: 'arya'
    }
  });

  TestParser.Case({
    case: '1.3.1',
    description: 'field.setValue() with options.onChange (commit)',
    parser: () => {
      const onChange = jest.fn((value: any) => value);
      const parser = new FakeParser({ ...options10, onChange });

      parser.parse();
      parser.field.setValue('jon');

      return parser;
    },
    expected: {
      model: 'jon',
      rawValue: 'jon',
      options: {
        onChange: (onChange: any) => onChange.mock.calls.length === 1
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
          labels: {}
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
});
