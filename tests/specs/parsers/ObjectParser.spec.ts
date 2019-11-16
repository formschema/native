/* eslint-disable @typescript-eslint/camelcase */

import { ObjectParser } from '@/parsers/ObjectParser';
import { ParserOptions } from '@/types';
import { JsonSchema } from '@/types/jsonschema';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/ObjectParser', () => {
  const options: ParserOptions<any, any> = {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: [ 'name' ]
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
          required: [ 'name' ]
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
          },
          getField({ value, field }: Scope) {
            expect(value('.name')).toBe(field.children.name);
            expect(value('.unexisting')).toBeNull();
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'Object with array',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            lastName: { type: 'string' },
            firstName: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        },
        model: {
          lastName: 'Jon',
          firstName: [ 'Stark', 'Targaryen' ]
        }
      })
    },
    expected: {
      parser: {
        field: {
          getField({ value, field }: Scope) {
            expect(value('.lastName')).toBe(field.children.lastName);
            expect(value('.firstName')).toBe(field.children.firstName);
            expect(value('.firstName[0]')).toBe(field.children.firstName.childrenList[0]);
            expect(value('.firstName[1]')).toBe(field.children.firstName.childrenList[1]);
            expect(value('.firstName[3]')).toBeNull();
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

  TestParser.Case({
    case: '3.0',
    description: 'schema with empty schema.properties',
    given: {
      parser: new ObjectParser({
        schema: { type: 'object', properties: {} },
        model: undefined
      })
    },
    expected: {
      parser: {
        properties: ({ value }: Scope) => expect(value).toEqual({}),
        dependencies: ({ value }: Scope) => expect(value).toEqual({}),
        childrenParsers: ({ value }: Scope) => expect(value).toEqual({}),
        field: {
          descriptor: {
            properties: ({ value }: Scope) => expect(value).toEqual({}),
            schemaProperties: ({ value }: Scope) => expect(value).toEqual({}),
            groups: ({ value }: Scope) => expect(value).toEqual({}),
            order: ({ value }: Scope) => expect(value).toEqual([]),
            orderedProperties: ({ value }: Scope) => expect(value).toEqual([]),
            parsedGroups: ({ value }: Scope) => expect(value).toEqual([])
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '4.0',
    description: 'schema with empty model should have field.value to equal to an empty object',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          },
          required: [ 'name' ]
        },
        model: {}
      })
    },
    expected: {
      parser: {
        field: {
          value: ({ value }: Scope) => expect(value).toEqual({ name: undefined })
        }
      }
    }
  });

  TestParser.Case({
    case: '4.1',
    description: 'schema with a defined schema.default should have field.value to equal to the default defined object',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', default: 'Goku' }
          },
          required: [ 'name' ]
        },
        model: {}
      })
    },
    expected: {
      parser: {
        field: {
          value: ({ value }: Scope) => expect(value).toEqual({ name: 'Goku' })
        }
      }
    }
  });

  TestParser.Case({
    case: '5.0',
    description: 'with field.descriptor.order, descriptor.orderedProperties should be filled with ordered fields',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dateBirth: { type: 'string' }
          }
        },
        model: {},
        descriptor: {
          order: [ 'lastName', 'dateBirth' ]
        }
      })
    },
    expected: {
      parser: {
        field: {
          descriptor: {
            orderedProperties: ({ value }: Scope) => expect(value).toEqual([ 'lastName', 'dateBirth', 'firstName' ])
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '5.1',
    description: 'with missing field.descriptor.order, descriptor.orderedProperties should be filled with defined fields order',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          }
        },
        model: {},
        descriptor: {}
      })
    },
    expected: {
      parser: {
        field: {
          descriptor: {
            orderedProperties: ({ value }: Scope) => expect(value).toEqual([ 'firstName', 'lastName' ])
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '6.0',
    description: 'Nested Object',
    given: {
      parser: new ObjectParser({
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
        descriptor: {}
      })
    },
    expected: {
      parser: {
        field({ parser }: Scope) {
          // field.children.name should have a defined attrs.name
          expect(parser.field.children.name.attrs.name).toBe('name');

          // field.value should be defined as an empty object with nested properties
          expect(parser.field.value).toEqual({
            name: {
              firstName: undefined,
              lastName: undefined
            },
            dateBirth: undefined
          });

          // field.value should be updated when setting a child model
          parser.field.children.dateBirth.setValue('-8600/01/02');
          parser.field.children.name.children.firstName.setValue('Jon');

          expect(parser.field.value).toEqual({
            name: {
              firstName: 'Jon',
              lastName: undefined
            },
            dateBirth: '-8600/01/02'
          });

          // field.value should be equal to the defined model using field.setValue()
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
        }
      }
    }
  });

  TestParser.Case({
    case: '6.1',
    description: 'Nested Object',
    given: {
      parser: new ObjectParser({
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
        descriptor: {}
      })
    },
    expected: {
      parser: {
        field: {
          getField({ value, field }: Scope) {
            expect(value('.name')).toBe(field.children.name);
            expect(value('.name.children.firstName')).toBe(field.children.name.children.firstName);
          }
        }
      }
    }
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
        credit_card: [ 'billing_address' ]
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
            credit_card: [ 'billing_address' ]
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
            const { options } = parser;
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
            const { options } = parser;
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
        reset({ parser }: Scope) {
          const onChange = parser.options.onChange;
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
        clear({ parser }: Scope) {
          const onChange = parser.options.onChange;
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

  TestParser.Case({
    case: '14.0',
    description: 'Messages with root field',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          }
        }
      })
    },
    expected: {
      parser: {
        addMessage({ field }: Scope) {
          field.addMessage('with default type');
          field.addMessage('without default type', 1);

          expect(field.messages).toEqual([
            { text: 'with default type', type: 3 },
            { text: 'without default type', type: 1 }
          ]);

          field.clearMessages();
          expect(field.messages).toEqual([]);
        }
      }
    }
  });

  TestParser.Case({
    case: '14.1',
    description: 'Messages with non root field',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' }
              }
            }
          }
        }
      })
    },
    expected: {
      parser: {
        addMessage({ field }: Scope) {
          field.children.name.children.firstName.addMessage('message from nested field', 1);

          expect(field.children.name.children.firstName.messages).toEqual([
            { text: 'message from nested field', type: 1 }
          ]);

          field.children.name.children.firstName.clearMessages();
          expect(field.children.name.children.firstName.messages).toEqual([]);
        }
      }
    }
  });

  TestParser.Case({
    case: '14.2',
    description: 'should clear messages recursively',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            name: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' }
              }
            }
          }
        }
      })
    },
    expected: {
      parser: {
        addMessage({ field }: Scope) {
          field.addMessage('with default type');
          field.children.name.children.firstName.addMessage('message from nested field', 1);

          field.clearMessages(true);

          expect(field.messages).toEqual([]);
          expect(field.children.name.children.firstName.messages).toEqual([]);
        }
      }
    }
  });
});
