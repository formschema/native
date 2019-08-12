import { Parser } from '@/parsers/Parser';
import { ObjectParser } from '@/parsers/ObjectParser';
import { ListField, ObjectField, ObjectFieldChild, ParserOptions } from '@/types';
import { JsonSchema } from '@/types/jsonschema';
import { TestParser, Scope } from '../../lib/TestParser';

import '@/parsers';

describe('parsers/ObjectParser', () => {
  const options: ParserOptions<any, any> = {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    },
    model: { name: 'Jon Snow' },
    name: 'profile'
  };

  TestParser.Case({
    case: '1.0',
    description: 'basic parsing',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          },
          required: ['name']
        },
        model: { name: 'Jon Snow' },
        name: 'profile'
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('object'),
        children({ value }: Scope) {
          for (const key in value) {
            expect(value[key].property).toBe(key);
            expect(value[key].deep).toBe(1);
          }
        },
        field: {
          value: ({ value }: Scope) => expect(value).toEqual({ name: 'Jon Snow' }),
          attrs: {
            name: ({ value }: Scope) => expect(value).toBeUndefined(),
            required: ({ value }: Scope) => expect(value).toBeUndefined()
          },
          deep: ({ value }: Scope) => expect(value).toBe(0),
          children({ value }: Scope) {
            for (const key in value) {
              expect(value[key].property).toBe(key);
              expect(value[key].deep).toBe(1);
            }
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'should successfully parse default object value',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          },
          default: {
            name: 'Arya Stark'
          }
        },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          value: ({ value }: Scope) => expect(value).toEqual({ name: 'Arya Stark' })
        }
      }
    }
  });

  TestParser.Case({
    case: '2.1',
    description: 'field.value should parse default non object value as an empty model',
    given: {
      parser: new ObjectParser({
        schema: { type: 'object' },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          value: ({ value }: Scope) => expect(value).toEqual({})
        }
      }
    }
  });

  // describe('schema with empty schema.properties', () => {
  //   const options: ParserOptions<any, any> = {
  //     schema: {
  //       type: 'object',
  //       properties: {}
  //     },
  //     model: {}
  //   };

  //   const parser = new ObjectParser(options);

  //   parser.parse();

  //   it('parser.orderedProperties have equal to an empty array', () => {
  //     expect(parser.orderedProperties).toEqual([]);
  //   });
  // });

  describe('schema with empty model', () => {
    const options: ParserOptions<any, any> = {
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      },
      model: {}
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.value should be equal to an empty object', () => {
      expect(parser.field.value).toEqual({ name: undefined });
    });
  });

  describe('schema with a defined schema.default', () => {
    const options: ParserOptions<any, any> = {
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', default: 'Goku' }
        },
        required: ['name']
      },
      model: {}
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.value should be equal to the default defined object', () => {
      expect(parser.field.value).toEqual({ name: 'Goku' });
    });
  });

  // describe('with field.descriptor.order', () => {
  //   const options: ParserOptions<any, any> = {
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         firstName: { type: 'string' },
  //         lastName: { type: 'string' },
  //         dateBirth: { type: 'string' }
  //       }
  //     },
  //     model: {}
  //   };

  //   const parser = new ObjectParser(options);

  //   parser.field.descriptor.order = ['lastName', 'dateBirth'];

  //   parser.parse();

  //   it('parser.orderedProperties should be equal to an empty array', () => {
  //     expect(parser.orderedProperties).toEqual(['lastName', 'dateBirth', 'firstName']);
  //   });
  // });

  // describe('with missing field.descriptor.order', () => {
  //   const options: ParserOptions<any, any> = {
  //     schema: {
  //       type: 'object',
  //       properties: {
  //         firstName: { type: 'string' },
  //         lastName: { type: 'string' }
  //       }
  //     },
  //     model: {}
  //   };

  //   const parser = new ObjectParser(options);

  //   delete parser.field.descriptor.order;

  //   parser.parse();

  //   it('parser.orderedProperties should be defined', () => {
  //     expect(parser.orderedProperties).toEqual(['firstName', 'lastName']);
  //   });
  // });

  describe('with nested object', () => {
    const options: ParserOptions<any, any> = {
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
      model: {}
    };

    const parser = new ObjectParser(options);

    parser.parse();

    it('field.children.name should have a defined attrs.name', () => {
      expect(parser.field.children.name.attrs.name).toBe('name');
    });

    it('field.value should be defined as an empty object with nested properties', () => {
      expect(parser.field.value).toEqual({
        name: {
          firstName: undefined,
          lastName: undefined
        },
        dateBirth: undefined
      });
    });

    it('field.value should be updated when setting a child model', () => {
      parser.field.children.dateBirth.setValue('-8600/01/02');

      expect(parser.field.value).toEqual({
        name: {
          firstName: undefined,
          lastName: undefined
        },
        dateBirth: '-8600/01/02'
      });
    });

    it('field.value should be equal to the defined model using field.setValue()', () => {
      parser.field.setValue({
        name: {
          firstName: 'Tyrion',
          lastName: 'Lannister'
        },
        dateBirth: '-8600/01/01'
      });

      expect(parser.field.value).toEqual({
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
    bracketedObjectInputName: bracketedObjectInputNameValue
  });

  TestParser.Case({
    case: '7.0',
    description: 'field.deep validation',
    given: {
      parser: new ObjectParser(options7(true))
    },
    expected: {
      parser: {
        field: {
          deep: ({ value }: Scope) => expect(value).toBe(0),
          children: {
            name: {
              deep: ({ value }: Scope) => expect(value).toBe(1),
              children: {
                first: {
                  deep: ({ value }: Scope) => expect(value).toBe(2)
                },
                last: {
                  deep: ({ value }: Scope) => expect(value).toBe(2)
                }
              }
            },
            dateBirth: {
              deep: ({ value }: Scope) => expect(value).toBe(1)
            }
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '8.0',
    description: 'nested object with name and bracketedObjectInputName === true',
    given: {
      parser: new ObjectParser(options7(true))
    },
    expected: {
      parser: {
        children: {
          name: {
            name: ({ value }: Scope) => expect(value).toBe('user[name]'),
            children: {
              first: {
                name: ({ value }: Scope) => expect(value).toBe('user[name][first]')
              },
              last: {
                name: ({ value }: Scope) => expect(value).toBe('user[name][last]')
              }
            }
          },
          dateBirth: {
            name: ({ value }: Scope) => expect(value).toBe('user[dateBirth]')
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '8.1',
    description: 'nested object with name and bracketedObjectInputName === false',
    given: {
      parser: new ObjectParser(options7(false))
    },
    expected: {
      parser: {
        children: {
          name: {
            name: ({ value }: Scope) => expect(value).toBe('user.name'),
            children: {
              first: {
                name: ({ value }: Scope) => expect(value).toBe('user.name.first')
              },
              last: {
                name: ({ value }: Scope) => expect(value).toBe('user.name.last')
              }
            }
          },
          dateBirth: {
            name: ({ value }: Scope) => expect(value).toBe('user.dateBirth')
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '9.0',
    description: 'isEmpty() with an empty object',
    given: {
      parser: new ObjectParser({
        schema: { type: 'object' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty({})).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '9.1',
    description: 'isEmpty() with a non empty object',
    given: {
      parser: new ObjectParser({
        schema: { type: 'object' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty({ x: 12 })).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '9.2',
    description: 'isEmpty() with default value',
    given: {
      parser: new ObjectParser({
        schema: { type: 'object', default: { x: 12 } }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty()).toBeFalsy()
      }
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
    }
  };

  TestParser.Case({
    case: '10.0',
    description: 'parseDependencies() with Property Dependencies',
    given: {
      parser: new ObjectParser(options100)
    },
    expected: {
      parser: {
        properties({ value, parser: { schema: { properties } } }: Scope) {
          expect(value).not.toBe(properties);
          expect(value).toEqual(properties);
        },
        dependencies({ value, parser: { schema: { dependencies } } }: Scope) {
          expect(value).not.toBe(dependencies);
          expect(value).toEqual(dependencies);
        }
      }
    }
  });

  TestParser.Case({
    case: '10.1',
    description: 'parseDependencies() with Schema Dependencies',
    given: {
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
        }
      })
    },
    expected: {
      parser: {
        properties({ value }: Scope) {
          expect(value).toEqual({
            name: { type: 'string' },
            credit_card: { type: 'number' },
            billing_address: { type: 'string' }
          });
        },
        dependencies({ value }: Scope) {
          expect(value).toEqual({
            name: [],
            credit_card: ['billing_address']
          });
        }
      }
    }
  });

  TestParser.Case({
    case: '11.0',
    description: 'updateDependencies() with Property Dependencies',
    given: {
      parser: new ObjectParser(options100)
    },
    expected: {
      parser: {
        field: {
          children({ value }: Scope) {
            for (const key in value) {
              expect(value[key].required).toBeFalsy();
            }
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '11.1',
    description: 'updateDependencies() with Property Dependencies',
    given: {
      parser() {
        const requestRender = jest.fn();
        const parser = new ObjectParser({ ...options100, requestRender });

        parser.parse();
        parser.field.children.credit_card.setValue(123);

        return parser;
      }
    },
    expected: {
      parser: {
        field: {
          children({ parser }: Scope) {
            const options: any = parser.options;
            const [ [ [ creditCardField, billingAddressField ] ] ] = options.requestRender.mock.calls;

            expect(options.requestRender).toBeCalled();

            expect(creditCardField.name).toBe('credit_card');
            expect(creditCardField.value).toBe(123);
            expect(creditCardField.required).toBeTruthy();

            expect(billingAddressField.name).toBe('billing_address');
            expect(billingAddressField.required).toBeTruthy();
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '11.2',
    description: 'updateDependencies() with Bidirectional Property Dependencies',
    given: {
      parser() {
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
        const parser = new ObjectParser({ schema, requestRender });

        parser.parse();
        parser.field.children.credit_card.setValue(123);
        parser.field.children.billing_address.setValue('Darling Street');
        parser.field.children.billing_address.setValue('');

        return parser;
      }
    },
    expected: {
      parser: {
        field: {
          children({ parser }: Scope) {
            const options: any = parser.options;
            const [ [ [ creditCardField, billingAddressField ] ] ] = options.requestRender.mock.calls;

            expect(options.requestRender).toBeCalled();

            expect(creditCardField.name).toBe('credit_card');
            expect(creditCardField.value).toBe(123);

            expect(billingAddressField.name).toBe('billing_address');
            expect(billingAddressField.value).toBe('');
            expect(billingAddressField.required).toBeTruthy();
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '12.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = { name: 'arya' };
        const onChange = jest.fn();
        const parser = new ObjectParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        reset({ value, parser }: Scope) {
          const onChange: any = parser.options.onChange;
          const expected = [
            { name: 'arya' },
            { name: 'jon' }
          ];

          expect(parser.rawValue).toEqual({ name: 'arya' });
          expect(parser.model).toEqual({ name: 'arya' });
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

          parser.field.children.name.setValue('jon');

          expect(onChange.mock.calls.length).toBe(2);
          expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
          expect(parser.rawValue).toEqual({ name: 'jon' });
          expect(parser.model).toEqual({ name: 'jon' });

          parser.reset(); // reset without calling onChange

          expect(onChange.mock.calls.length).toBe(2);
          expect(parser.initialValue).toEqual({ name: 'arya' });
          expect(parser.rawValue).toEqual({ name: 'arya' });
          expect(parser.model).toEqual({ name: 'arya' });

          parser.field.reset(); // reset with calling onChange

          expect(onChange.mock.calls.length).toBe(3);
          expect(onChange.mock.calls[2][0]).toEqual(expected[0]);
        }
      }
    }
  });

  TestParser.Case({
    case: '13.0',
    description: 'parser.clear()',
    given: {
      parser() {
        const model = { name: 'arya' };
        const onChange = jest.fn();
        const parser = new ObjectParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        clear({ value, parser }: Scope) {
          const onChange: any = parser.options.onChange;
          const expected = [
            { name: 'arya' },
            { name: 'jon' }
          ];

          expect(parser.rawValue).toEqual({ name: 'arya' });
          expect(parser.model).toEqual({ name: 'arya' });
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

          parser.field.children.name.setValue('jon');

          expect(onChange.mock.calls.length).toBe(2);
          expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
          expect(parser.rawValue).toEqual({ name: 'jon' });
          expect(parser.model).toEqual({ name: 'jon' });

          parser.clear(); // clear without calling onChange

          expect(onChange.mock.calls.length).toBe(2);
          expect(parser.initialValue).toEqual({ name: 'arya' });
          expect(parser.rawValue).toEqual({});
          expect(parser.model).toEqual({});

          parser.field.clear(); // clear with calling onChange

          expect(onChange.mock.calls.length).toBe(3);
          expect(onChange.mock.calls[2][0]).toEqual({});
        }
      }
    }
  });
});
