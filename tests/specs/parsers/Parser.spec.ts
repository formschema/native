import { Component } from 'vue';
import { Parser } from '@/parsers/Parser';
import { Dict, ObjectField, StringField, UnknowParser, ParserOptions, ScalarDescriptor, ObjectDescriptor } from '@/types';
import { Objects } from '@/lib/Objects';
import { JsonSchema } from '@/types/jsonschema';
import { Options } from '../../lib/Options';
import { TestParser, Scope } from '../../lib/TestParser';

class FakeParser extends Parser<any, StringField, ScalarDescriptor> {
  constructor(options: ParserOptions<any>, parent?: UnknowParser) {
    super('string', options, parent);
  }

  parse() {}
}

class ObjectFakeParser extends Parser<Dict, ObjectField, ObjectDescriptor> {
  constructor(options: ParserOptions<Dict>, parent?: UnknowParser) {
    super('object', options, parent);
  }

  parseValue(data: any): any {
    return data || {};
  }

  parse() {}
}

class InputFakeParser extends Parser<string, StringField, ScalarDescriptor> {
  constructor(options: ParserOptions<string>, parent?: UnknowParser) {
    super('string', options, parent);
  }

  parseValue(data: any): string {
    return data;
  }

  parse() {}
}

const ParserValidator = {
  parser: {
    isRoot: true,
    parent: undefined,
    root: ({ value, parser }: Scope) => expect(value).toBe(parser),
    options: ({ value }: Scope) => {
      expect(typeof value).toBe('object');
      expect(value).not.toBeNull();
    },
    schema: ({ value, parser: { options } }: Scope) => expect(value).toBe(options.schema),
    model: ({ value, parser: { initialValue } }: Scope<FakeParser>) => expect(value).toBe(initialValue),
    rawValue: ({ value, parser: { initialValue } }: Scope<FakeParser>) => expect(value).toBe(initialValue),
    kind: ({ value, parser: { schema } }: Scope) => expect(value).toBe(schema.type),
    id: ({ value }: Scope) => expect(typeof value).toBe('string'),
    initialValue: ({ value, parser: { options, schema } }: Scope) => [schema.default, options.model].includes(value),
    field: {
      kind: ({ value, parser }: Scope) => expect(value).toBe(parser.kind),
      name: ({ value, parser }: Scope) => expect(value).toBe(parser.options.name),
      isRoot: ({ value, parser }: Scope) => expect(value).toBe(parser.isRoot),
      schema: ({ value, parser: { options } }: Scope) => expect(value).toBe(options.schema),
      required: ({ value, parser }: Scope) => expect(value).toBe(parser.options.required || false),
      parent: ({ value, parser }: Scope) => parser.parent ? expect(value).toBe(parser.parent.field) : expect(value).toBeUndefined(),
      root: ({ value, parser }: Scope) => expect(value).toBe(parser.root.field),
      deep: ({ value, parser }: Scope) => parser.field.parent ? expect(value).toBe(parser.field.parent.deep + 1) : expect(value).toBe(0),
      attrs: {
        id: ({ value, parser }: Scope) => expect(value).toBe(parser.id),
        type: ({ value }: Scope) => expect(value).toBeUndefined(),
        name: ({ value, parser: { options } }: Scope) => expect(value).toBe(options.name),
        readonly: ({ value, parser: { schema } }: Scope) => expect(value).toBe(schema.readOnly),
        required: ({ value, parser: { field } }: Scope) => expect(value).toBe(field.required),
        'aria-required': ({ value, parser: { field } }: Scope) => expect(value).toBe(field.required ? 'true' : undefined)
      },
      value: ({ value, parser }: Scope) => expect(value).toBe(parser.model),
      setValue: ({ value }: Scope) => expect(value).toBeInstanceOf(Function),
      commit: ({ value }: Scope) => expect(value).toBeInstanceOf(Function),
      reset: ({ value }: Scope) => expect(value).toBeInstanceOf(Function),
      clear: ({ value }: Scope) => expect(value).toBeInstanceOf(Function),
      requestRender: ({ value }: Scope) => expect(value).toBeInstanceOf(Function)
    }
  },
  descriptor: {
    attrs: {
      'aria-labelledby': ({ value, descriptor: { labelAttrs } }: Scope) => expect(value).toBe(labelAttrs.id),
      'aria-describedby': ({ value, descriptor: { helperAttrs } }: Scope) => expect(value).toBe(helperAttrs.id)
    },
    label({ value, given: { descriptor, parser: { options } } }: Scope) {
      expect(value).toBe(descriptor.label || options.schema.title || '');
    },
    helper({ value, given: { descriptor, parser: { options } } }: Scope) {
      expect(value).toBe(descriptor.helper || options.schema.description || '');
    },
    component: ({ value }: Scope) => expect(value).toBeDefined(),
    labelAttrs: {
      id: ({ value }: Scope) => typeof value === 'undefined' || expect(value.endsWith('-label')).toBeTruthy(),
      for: ({ value, descriptor: { field } }: Scope) => expect(value).toBe(field.attrs.id)
    },
    helperAttrs: {
      id: ({ value }: Scope) => typeof value === 'undefined' || expect(value.endsWith('-helper')).toBeTruthy()
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
        schema: { type: 'string' }
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
        }
      };

      const childOptions: any = {
        schema: options.schema.properties.name
      };

      const parent: any = Parser.get(options);
      const child: any = Parser.get(childOptions, parent);

      expect(child).toBeInstanceOf(InputFakeParser);
      expect(child.parent).toBeInstanceOf(ObjectFakeParser);
    });
  });

  const options10: any = {
    schema: { type: 'string' },
    model: ''
  };

  TestParser.Case({
    case: '1.0',
    given: {
      parser: new FakeParser(options10)
    },
    expected: ParserValidator
  });

  TestParser.Case({
    case: '1.1',
    given: {
      parser: new FakeParser({
        schema: { type: 'string', default: 'Hello' },
        model: undefined
      })
    },
    expected: ParserValidator
  });

  TestParser.Case({
    case: '1.2',
    description: 'with options.required === true',
    given: {
      parser: new FakeParser({
        schema: { type: 'string' },
        model: undefined,
        required: true
      })
    },
    expected: ParserValidator
  });

  TestParser.Case({
    case: '1.3.0',
    description: 'field.setValue() without options.onChange',
    given: {
      parser() {
        const parser = new FakeParser(options10);

        parser.parse();
        parser.field.setValue('arya');

        return parser;
      }
    },
    expected: {
      parser: {
        model: 'arya',
        rawValue: 'arya'
      }
    }
  });

  TestParser.Case({
    case: '1.3.1',
    description: 'field.setValue(value, true) with options.onChange (commit)',
    given: {
      parser() {
        const onChange = jest.fn();
        const parser = new FakeParser({ ...options10, onChange });

        parser.parse();
        parser.field.setValue('jon');

        return parser;
      }
    },
    expected: {
      parser: {
        model: 'jon',
        rawValue: 'jon',
        options: {
          onChange({ value: onChange }: Scope) {
            expect(onChange.mock.calls.length).toBe(1);
            expect(onChange.mock.calls[0][0]).toBe('jon');
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '1.3.2',
    description: 'field.setValue(value, false) with options.onChange and field.commit() (commit)',
    given: {
      parser() {
        const onChange = jest.fn();
        const parser = new FakeParser({ ...options10, onChange });

        parser.parse();
        parser.field.setValue('jon', false);

        return parser;
      }
    },
    expected: {
      parser: {
        model: 'jon',
        rawValue: 'jon',
        options: {
          onChange({ value: onChange, parser }: Scope) {
            expect(onChange.mock.calls.length).toBe(0);

            parser.field.commit();

            expect(onChange.mock.calls.length).toBe(1);
            expect(onChange.mock.calls[0][0]).toBe('jon');
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0: Parser.kind()',
    description: 'should return an enum parser with schema.num.length < 5',
    given: Options.get({
      schema: {
        type: 'number',
        enum: [1, 2, 3, 4]
      }
    }),
    expected: {
      parser: {
        kind: 'enum'
      }
    }
  });

  TestParser.Case({
    case: '2.1: Parser.kind()',
    description: 'should return a list parser with schema.num.length > 4',
    given: Options.get({
      schema: {
        type: 'number',
        enum: [1, 2, 3, 4, 5]
      }
    }),
    expected: {
      parser: {
        kind: 'list'
      }
    }
  });

  TestParser.Case({
    case: '3.0: parser.parseValue()',
    description: 'should successfully parse value with boolean schema',
    given: Options.get({
      kind: 'list',
      schema: {
        type: 'boolean',
        enum: [true, false]
      }
    }),
    expected: {
      parser: {
        parseValue({ parser }: Scope<any>) {
          expect(parser.parseValue('true')).toBe(true);
          expect(parser.parseValue('false')).toBe(false);
          expect(parser.parseValue('unknow')).toBe(false);
          expect(parser.parseValue(undefined)).toBe(false);
        }
      }
    }
  });

  TestParser.Case({
    case: '3.1: parser.parseValue()',
    description: 'should successfully parse value with string schema',
    given: Options.get({
      kind: 'list',
      schema: {
        type: 'string'
      }
    }),
    expected: {
      parser: {
        parseValue({ parser }: Scope<any>) {
          expect(parser.parseValue('true')).toBe('true');
          expect(parser.parseValue('false')).toBe('false');
          expect(parser.parseValue(undefined)).toBe(undefined);
        }
      }
    }
  });

  TestParser.Case({
    case: '3.2: parser.parseValue()',
    description: 'should successfully parse value with a number schema',
    given: Options.get({
      kind: 'list',
      schema: {
        type: 'number'
      }
    }),
    expected: {
      parser: {
        parseValue({ parser }: Scope<any>) {
          expect(parser.parseValue('12')).toBe(12);
          expect(parser.parseValue('0.5')).toBe(0.5);
          expect(parser.parseValue(undefined)).toBe(undefined);
        }
      }
    }
  });

  TestParser.Case({
    case: '3.2: parser.parseValue()',
    description: 'should successfully parse value with an integer schema',
    given: Options.get({
      kind: 'list',
      schema: {
        type: 'integer'
      }
    }),
    expected: {
      parser: {
        parseValue({ parser }: Scope<any>) {
          expect(parser.parseValue('12')).toBe(12);
          expect(parser.parseValue('0.5')).toBe(0);
          expect(parser.parseValue(undefined)).toBe(undefined);
        }
      }
    }
  });

  TestParser.Case({
    case: '3.3: parser.parseValue()',
    description: 'should successfully parse value with a null schema',
    given: Options.get({
      kind: 'list',
      schema: {
        type: 'null'
      }
    }),
    expected: {
      parser: {
        parseValue({ parser }: Scope<any>) {
          expect(parser.parseValue('12')).toBe(null);
          expect(parser.parseValue('0.5')).toBe(null);
          expect(parser.parseValue(undefined)).toBe(null);
        }
      }
    }
  });

  TestParser.Case({
    case: '4.0',
    description: 'parser.requestRender()',
    given: {
      parser: new FakeParser({ ...options10, requestRender: jest.fn() })
    },
    expected: {
      parser: {
        options: {
          requestRender({ value: requestRender, parser }: Scope) {
            let oldFieldKey = parser.field.key;

            // calling requestRender() with arguments without
            // updated the field.key value have no effect
            parser.requestRender([parser.field]);
            expect(parser.field.key).toEqual(oldFieldKey);


            // calling requestRender() with arguments after
            // updated the field.key value have no effect
            parser.field.key = 'random-key';
            parser.requestRender([parser.field]);
            expect(parser.field.key).not.toEqual(oldFieldKey);

            oldFieldKey = parser.field.key;

            // calling requestRender() without arguments will
            // automatically update the field.key value
            parser.requestRender();
            expect(parser.field.key).not.toEqual(oldFieldKey);

            oldFieldKey = parser.field.key;

            // field.requestRender() is an alias of parser.requestRender()
            parser.field.requestRender();
            expect(parser.field.key).not.toEqual(oldFieldKey);

            expect(requestRender.mock.calls.length).toBe(4);
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '4.1',
    description: 'parser.requestRender() with options.requestRender as non function',
    given: {
      parser() {
        const requestRender = { x: jest.fn() };
        const parser = new FakeParser({ ...options10, requestRender });

        parser.parse();
        parser.requestRender([parser.field]);

        return parser;
      }
    },
    expected: {
      parser: {
        options({ value: options }: Scope) {
          expect(options.requestRender.x.mock.calls.length).toBe(0);
        }
      }
    }
  });

  TestParser.Case({
    case: '5.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = 'arya';
        const onChange = jest.fn();
        const parser = new FakeParser({ ...options10, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          expect(parser.rawValue).toBe('arya');
          expect(parser.model).toBe('arya');

          parser.field.setValue('jon');

          expect(parser.rawValue).toBe('jon');
          expect(parser.model).toBe('jon');

          parser.reset(); // reset without calling onChange

          expect(parser.rawValue).toBe('arya');
          expect(parser.model).toBe('arya');

          parser.field.reset(); // reset with calling onChange

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual(['jon', 'arya']);
        }
      }
    }
  });

  TestParser.Case({
    case: '6.0',
    description: 'parser.clear()',
    given: {
      parser() {
        const model = 'arya';
        const onChange = jest.fn();
        const parser = new FakeParser({ ...options10, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          expect(parser.rawValue).toBe('arya');
          expect(parser.model).toBe('arya');

          parser.field.setValue('jon');

          expect(parser.rawValue).toBe('jon');
          expect(parser.model).toBe('jon');

          parser.clear(); // clear without calling onChange

          expect(parser.rawValue).toBeUndefined();
          expect(parser.model).toBeUndefined();

          parser.field.clear(); // clear with calling onChange

          const onChange: any = parser.options.onChange;
          const result = onChange.mock.calls.map(([value]: any) => value);

          expect(result).toEqual(['jon', undefined]);
        }
      }
    }
  });
});
