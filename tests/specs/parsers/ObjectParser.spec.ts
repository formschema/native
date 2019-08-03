import { Parser } from '@/parsers/Parser';
import { ObjectParser } from '@/parsers/ObjectParser';
import { Dictionary, ListField, ObjectField, ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';
import { JsonSchema } from '@/types/jsonschema';
import { TestParser } from '../../lib/TestParser';

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
    descriptorConstructor: new NativeDescriptor(NativeElements)
  };

  const parser = new ObjectParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.kind should have equal to `object`', () => {
    expect(parser.kind).toBe('object');
  });

  it('parser.children should be defined', () => {
    expect(parser.children.length).toBe(1);
  });

  it('field.input.attrs.required should be undefined', () => {
    expect(parser.field.input.attrs.required).toBeUndefined();
  });

  it('field.input.attrs.aria-required should be undefined', () => {
    expect(parser.field.input.attrs['aria-required']).toBeUndefined();
  });

  it('field.input.attrs.name should be undefined', () => {
    expect(parser.field.input.attrs.name).toBeUndefined();
  });

  it('field.value should be equal to the default value', () => {
    expect(parser.field.input.value).toEqual({ name: 'Jon Snow' });
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    parser.parse();

    expect(parser.field.input.value).toEqual({
      name: 'Arya Stark'
    });
  });

  it('field.value should parse default non object value as an empty model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'object' },
      model: undefined,
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    parser.parse();

    expect(parser.field.input.value).toEqual({});
  });

  describe('schema with empty schema.properties', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: {
        type: 'object',
        properties: {}
      },
      model: {},
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('parser.orderedProperties have equal to an empty array', () => {
      expect(parser.orderedProperties).toEqual([]);
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.value should be equal to an empty object', () => {
      expect(parser.field.input.value).toEqual({ name: undefined });
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.value should be equal to the default defined object', () => {
      expect(parser.field.input.value).toEqual({ name: 'Goku' });
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    parser.field.descriptor.order = ['lastName', 'dateBirth'];

    parser.parse();

    it('parser.orderedProperties should be equal to an empty array', () => {
      expect(parser.orderedProperties).toEqual(['lastName', 'dateBirth', 'firstName']);
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    delete parser.field.descriptor.order;

    parser.parse();

    it('parser.orderedProperties should be defined', () => {
      expect(parser.orderedProperties).toEqual(['firstName', 'lastName']);
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
      descriptorConstructor: new NativeDescriptor(NativeElements)
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.children.name should have a defined input.attrs.name', () => {
      expect(parser.field.children[0].input.attrs.name).toBe('name');
    });

    it('field.value should be defined as an empty object with nested properties', () => {
      expect(parser.field.input.value).toEqual({
        name: {
          firstName: undefined,
          lastName: undefined
        },
        dateBirth: undefined
      });
    });

    it('field.value should be updated when setting a child model', () => {
      parser.field.children[1].input.setValue('-8600/01/02');

      expect(parser.field.input.value).toEqual({
        name: {
          firstName: undefined,
          lastName: undefined
        },
        dateBirth: '-8600/01/02'
      });
    });

    it('field.value should be equal to the defined model using field.input.setValue()', () => {
      parser.field.input.setValue({
        name: {
          firstName: 'Tyrion',
          lastName: 'Lannister'
        },
        dateBirth: '-8600/01/01'
      });

      expect(parser.field.input.value).toEqual({
        name: {
          firstName: 'Tyrion',
          lastName: 'Lannister'
        },
        dateBirth: '-8600/01/01'
      });
    });
  });

  const options7: any = (bracketedObjectInputNameValue: boolean) => ({
    name: 'user',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'object',
          properties: {
            first: { type: 'string' },
            last: { type: 'string' }
          }
        },
        dateBirth: { type: 'string' }
      }
    },
    model: {},
    descriptorConstructor: new NativeDescriptor(NativeElements),
    bracketedObjectInputName: bracketedObjectInputNameValue
  });

  TestParser.Case({
    case: '7.0',
    description: 'field.deep validation',
    parser: new ObjectParser(options7(true)),
    expected: {
      field: {
        deep: (value: number) => expect(value).toBe(0),
        children: (values: ObjectField[]) => values.forEach(({ deep }) => expect(deep).toBe(1))
      }
    }
  });

  const names = ['name', 'dateBirth'];
  const nestedNames = ['first', 'last'];

  TestParser.Case({
    case: '8.0',
    description: 'nested object with name and bracketedObjectInputName === true',
    parser: new ObjectParser(options7(true)),
    expected: {
      children(items: ListField[]) {
        items.forEach(({ kind, name, children }: any, i: number) => {
          if (kind === 'object') {
            children.forEach(({ name: nestedName }: any, j: number) => {
              expect(nestedName).toBe(`user[${names[i]}][${nestedNames[j]}]`);
            });
          } else {
            expect(name).toBe(`user[${names[i]}]`);
          }
        });
      }
    }
  });

  TestParser.Case({
    case: '8.1',
    description: 'nested object with name and bracketedObjectInputName === false',
    parser: new ObjectParser(options7(false)),
    expected: {
      children(items: ListField[]) {
        items.forEach(({ kind, name, children }: any, i: number) => {
          if (kind === 'object') {
            children.forEach(({ name: nestedName }: any, j: number) => {
              expect(nestedName).toBe(`user.${names[i]}.${nestedNames[j]}`);
            });
          } else {
            expect(name).toBe(`user.${names[i]}`);
          }
        });
      }
    }
  });

  TestParser.Case({
    case: '9.0',
    description: 'isEmpty() with an empty object',
    parser: new ObjectParser({
      schema: { type: 'object' },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function) => expect(fn({})).toBeTruthy()
    }
  });

  TestParser.Case({
    case: '9.1',
    description: 'isEmpty() with a non empty object',
    parser: new ObjectParser({
      schema: { type: 'object' },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function) => expect(fn({ x: 12 })).toBeFalsy()
    }
  });

  TestParser.Case({
    case: '9.2',
    description: 'isEmpty() with default value',
    parser: new ObjectParser({
      schema: { type: 'object', default: { x: 12 } },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      isEmpty: (fn: Function, parser: ObjectParser) => expect(fn.apply(parser)).toBeFalsy()
    }
  });

  const options100: any = {
    schema: {
      type: 'object',
      properties: {
        credit_card: { type: 'number' },
        billing_address: { type: 'string' }
      },
      dependencies: {
        credit_card: ['billing_address']
      }
    },
    descriptorConstructor: new NativeDescriptor(NativeElements)
  };

  TestParser.Case({
    case: '10.0',
    description: 'parseDependencies() with Property Dependencies',
    parser: new ObjectParser(options100),
    expected: {
      properties: (value: Dictionary<JsonSchema>, { schema: { properties } }: ObjectParser) => {
        expect(value).not.toBe(properties);
        expect(value).toEqual(properties);
      },
      dependencies: (value: Dictionary<string[]>, { schema: { dependencies } }: ObjectParser) => {
        expect(value).not.toBe(dependencies);
        expect(value).toEqual(dependencies);
      }
    }
  });

  TestParser.Case({
    case: '10.1',
    description: 'parseDependencies() with Schema Dependencies',
    parser: new ObjectParser({
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          credit_card: { type: 'number' }
        },
        dependencies: {
          name: {
            type: 'object'
          },
          credit_card: {
            type: 'object',
            properties: {
              billing_address: { type: 'string' }
            }
          }
        }
      },
      descriptorConstructor: new NativeDescriptor(NativeElements)
    }),
    expected: {
      properties(value: Dictionary<JsonSchema>) {
        expect(value).toEqual({
          name: { type: 'string' },
          credit_card: { type: 'number' },
          billing_address: { type: 'string' }
        });
      },
      dependencies(value: Dictionary<string[]>) {
        expect(value).toEqual({
          name: [],
          credit_card: ['billing_address']
        });
      }
    }
  });

  TestParser.Case({
    case: '11.0',
    description: 'updateDependencies() with Property Dependencies',
    parser: new ObjectParser(options100),
    expected: {
      field: {
        children(values: ObjectField[]) {
          values.forEach(({ required }) => expect(required).toBeFalsy());
        }
      }
    }
  });

  TestParser.Case({
    case: '11.1',
    description: 'updateDependencies() with Property Dependencies',
    parser: () => {
      const requestRender = jest.fn();
      const parser = new ObjectParser({ ...options100, requestRender });

      parser.parse();
      parser.field.children[0].input.setValue(123);

      return parser;
    },
    expected: {
      field: {
        children(values: ObjectField[], { options }: any) {
          const [ [ [ creditCardField, billingAddressField ] ] ] = options.requestRender.mock.calls;

          expect(options.requestRender).toBeCalled();

          expect(creditCardField.name).toBe('credit_card');
          expect(creditCardField.input.value).toBe(123);
          expect(creditCardField.required).toBeTruthy();

          expect(billingAddressField.name).toBe('billing_address');
          expect(billingAddressField.required).toBeTruthy();
        }
      }
    }
  });

  TestParser.Case({
    case: '11.2',
    description: 'updateDependencies() with Bidirectional Property Dependencies',
    parser: () => {
      const schema: JsonSchema = {
        type: 'object',
        properties: {
          credit_card: {
            type: 'number'
          },
          billing_address: {
            type: 'string'
          }
        },
        dependencies: {
          credit_card: [
            'billing_address'
          ],
          billing_address: [
            'credit_card'
          ]
        }
      };

      const requestRender = jest.fn();
      const descriptorConstructor = new NativeDescriptor(NativeElements);

      const parser = new ObjectParser({ schema, requestRender, descriptorConstructor });

      parser.parse();
      parser.field.children[0].input.setValue(123);
      parser.field.children[1].input.setValue('Darling Street');
      parser.field.children[1].input.setValue('');

      return parser;
    },
    expected: {
      field: {
        children(values: ObjectField[], { options }: any) {
          const [ [ [ creditCardField, billingAddressField ] ] ] = options.requestRender.mock.calls;

          expect(options.requestRender).toBeCalled();

          expect(creditCardField.name).toBe('credit_card');
          expect(creditCardField.input.value).toBe(123);

          expect(billingAddressField.name).toBe('billing_address');
          expect(billingAddressField.input.value).toBe('');
          expect(billingAddressField.required).toBeTruthy();
        }
      }
    }
  });

  TestParser.Case({
    case: '12.0',
    description: 'parser.reset()',
    parser: () => {
      const model = { name: 'arya' };
      const onChange = jest.fn();
      const parser = new ObjectParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        const onChange = parser.options.onChange;
        const expected = [
          { name: 'arya' },
          { name: 'jon' }
        ];

        expect(parser.rawValue).toEqual({ name: 'arya' });
        expect(parser.model).toEqual({ name: 'arya' });
        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

        parser.field.children[0].input.setValue('jon');

        expect(onChange.mock.calls.length).toBe(2);
        expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
        expect(parser.rawValue).toEqual({ name: 'jon' });
        expect(parser.model).toEqual({ name: 'jon' });

        parser.reset(); // reset without calling onChange

        expect(onChange.mock.calls.length).toBe(2);
        expect(parser.initialValue).toEqual({ name: 'arya' });
        expect(parser.rawValue).toEqual({ name: 'arya' });
        expect(parser.model).toEqual({ name: 'arya' });

        parser.field.input.reset(); // reset with calling onChange

        expect(onChange.mock.calls.length).toBe(3);
        expect(onChange.mock.calls[2][0]).toEqual(expected[0]);
      }
    }
  });

  TestParser.Case({
    case: '13.0',
    description: 'parser.clear()',
    parser: () => {
      const model = { name: 'arya' };
      const onChange = jest.fn();
      const parser = new ObjectParser({ ...options, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      clear(fn: Function, parser: any) {
        const onChange = parser.options.onChange;
        const expected = [
          { name: 'arya' },
          { name: 'jon' }
        ];

        expect(parser.rawValue).toEqual({ name: 'arya' });
        expect(parser.model).toEqual({ name: 'arya' });
        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

        parser.field.children[0].input.setValue('jon');

        expect(onChange.mock.calls.length).toBe(2);
        expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
        expect(parser.rawValue).toEqual({ name: 'jon' });
        expect(parser.model).toEqual({ name: 'jon' });

        parser.clear(); // clear without calling onChange

        expect(onChange.mock.calls.length).toBe(2);
        expect(parser.initialValue).toEqual({ name: 'arya' });
        expect(parser.rawValue).toEqual({});
        expect(parser.model).toEqual({});

        parser.field.input.clear(); // clear with calling onChange

        expect(onChange.mock.calls.length).toBe(3);
        expect(onChange.mock.calls[2][0]).toEqual({});
      }
    }
  });
});
