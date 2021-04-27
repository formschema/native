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
        fields({ value }: Scope) {
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
          fields({ value }: Scope) {
            for (const key in value) {
              expect(value[key].property).toBe(key);
              expect(value[key].deep).toBe(1);
            }
          },
          getField({ value, field }: Scope) {
            expect(value('.name')).toBe(field.fields.name);
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
            expect(value('.lastName')).toBe(field.fields.lastName);
            expect(value('.firstName')).toBe(field.fields.firstName);
            expect(value('.firstName[0]')).toBe(field.fields.firstName.children[0]);
            expect(value('.firstName[1]')).toBe(field.fields.firstName.children[1]);
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
          // field.fields.name should have a defined attrs.name
          expect(parser.field.fields.name.attrs.name).toBe('name');

          // field.value should be defined as an empty object with nested properties
          expect(parser.field.value).toEqual({
            name: {
              firstName: undefined,
              lastName: undefined
            },
            dateBirth: undefined
          });

          // field.value should be updated when setting a child model
          parser.field.fields.dateBirth.setValue('-8600/01/02');
          parser.field.fields.name.fields.firstName.setValue('Jon');

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
            expect(value('.name')).toBe(field.fields.name);
            expect(value('.name.fields.firstName')).toBe(field.fields.name.fields.firstName);
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
          fields: {
            name: {
              deep: ({ value }: Scope) => expect(value).toBe(1),
              fields: {
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
        fields: {
          name: {
            name: ({ value }: Scope) => expect(value).toBe('user[name]'),
            fields: {
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
        fields: {
          name: {
            name: ({ value }: Scope) => expect(value).toBe('user.name'),
            fields: {
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
        parser.field.fields.credit_card.setValue(123);

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
        parser.field.fields.credit_card.setValue(123);
        parser.field.fields.billing_address.setValue('Darling Street');
        parser.field.fields.billing_address.setValue('');

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

          parser.field.fields.name.setValue('jon');

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

          parser.field.fields.name.setValue('jon');

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
          field.fields.name.fields.firstName.addMessage('message from nested field', 1);

          expect(field.fields.name.fields.firstName.messages).toEqual([
            { text: 'message from nested field', type: 1 }
          ]);

          field.fields.name.fields.firstName.clearMessages();
          expect(field.fields.name.fields.firstName.messages).toEqual([]);
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
          field.fields.name.fields.firstName.addMessage('message from nested field', 1);

          field.clearMessages(true);

          expect(field.messages).toEqual([]);
          expect(field.fields.name.fields.firstName.messages).toEqual([]);
        }
      }
    }
  });

  TestParser.Case({
    case: '15.0',
    description: 'conditional schema',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: [
                      'string',
                      'html',
                      'image',
                      'any'
                    ]
                  }
                },
                if: {
                  properties: {
                    type: {
                      const: 'string'
                    }
                  }
                },
                then: {
                  properties: {
                    value: {
                      type: 'string',
                      default: 'text/plain'
                    }
                  }
                },
                else: {
                  if: {
                    properties: {
                      type: {
                        const: 'html'
                      }
                    }
                  },
                  then: {
                    properties: {
                      value: {
                        type: 'string',
                        default: 'text/html'
                      }
                    }
                  },
                  else: {
                    if: {
                      properties: {
                        type: {
                          const: 'image'
                        }
                      }
                    },
                    then: {
                      properties: {
                        value: {
                          type: 'string',
                          default: 'image/jpeg'
                        }
                      }
                    },
                    else: {
                      properties: {
                        value: {
                          type: 'string',
                          default: 'text/any'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })
    },
    expected: {
      parser: {
        parseConditional({ field, parser: { schema } }: Scope) {
          const SectionsSchema = schema.properties.sections;
          const ItemsSchema = SectionsSchema.items;
          const TypeSchema = ItemsSchema.properties.type;

          // initially, model is empty
          expect(field.value).toEqual({
            sections: []
          });

          /**
           * scope: default section
           * action: click to the push button
           * expected: an empty section
           */
          field.fields.sections.pushButton.trigger();
          expect(field.value).toEqual({
            sections: [
              { type: undefined, value: 'text/any' }
            ]
          });

          /**
           * scope: first section
           * action: check the first radio button
           * expected: conditional process updates the section.value field
           *           with the default value defined in the 'then' schema
           */
          field.fields.sections.children[0].fields.type.setValue(TypeSchema.enum[0]);
          expect(field.value).toEqual({
            sections: [
              { type: TypeSchema.enum[0], value: ItemsSchema.then.properties.value.default }
            ]
          });

          /**
           * scope: second section
           * action: add a second section and check its second radio button
           * expected: conditional process updates the section.value field
           *           with the default value defined in the 'else.then' schema
           */
          field.fields.sections.pushButton.trigger();
          field.fields.sections.children[1].fields.type.setValue(TypeSchema.enum[1]);
          expect(field.value).toEqual({
            sections: [
              { type: TypeSchema.enum[0], value: ItemsSchema.then.properties.value.default },
              { type: TypeSchema.enum[1], value: ItemsSchema.else.then.properties.value.default }
            ]
          });

          /**
           * scope: third section
           * action: add a third section and check its third radio button
           * expected: conditional process updates the section.value field
           *           with the default value defined in the 'else.else.then' schema
           */
          field.fields.sections.pushButton.trigger();
          field.fields.sections.children[2].fields.type.setValue(TypeSchema.enum[2]);
          expect(field.value).toEqual({
            sections: [
              { type: TypeSchema.enum[0], value: ItemsSchema.then.properties.value.default },
              { type: TypeSchema.enum[1], value: ItemsSchema.else.then.properties.value.default },
              { type: TypeSchema.enum[2], value: ItemsSchema.else.else.then.properties.value.default }
            ]
          });

          /**
           * scope: lat section
           * action: add a new section and check its last radio button
           * expected: conditional process updates the section.value field
           *           with the default value defined in the 'else.else.else' schema
           */
          field.fields.sections.pushButton.trigger();
          field.fields.sections.children[3].fields.type.setValue(TypeSchema.enum[3]);
          expect(field.value).toEqual({
            sections: [
              { type: TypeSchema.enum[0], value: ItemsSchema.then.properties.value.default },
              { type: TypeSchema.enum[1], value: ItemsSchema.else.then.properties.value.default },
              { type: TypeSchema.enum[2], value: ItemsSchema.else.else.then.properties.value.default },
              { type: TypeSchema.enum[3], value: ItemsSchema.else.else.else.properties.value.default }
            ]
          });
        }
      }
    }
  });

  TestParser.Case({
    case: '15.1',
    description: 'conditional schema with default values',
    given: {
      parser: new ObjectParser({
        schema: {
          type: 'object',
          properties: {
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    default: 'html',
                    enum: [
                      'string',
                      'html'
                    ]
                  },
                  value: {
                    type: 'string',
                    default: 'text/html'
                  }
                },
                if: {
                  properties: {
                    type: {
                      const: 'html'
                    }
                  }
                },
                then: {
                  properties: {
                    value: {
                      default: 'text/html'
                    }
                  }
                }
              }
            }
          }
        }
      })
    },
    expected: {
      parser: {
        parseConditional({ field, parser: { schema } }: Scope) {
          const SectionsSchema = schema.properties.sections;
          const ItemsSchema = SectionsSchema.items;
          const TypeSchema = ItemsSchema.properties.type;
          const ValueSchema = ItemsSchema.properties.value;

          // initially, model is empty
          expect(field.value).toEqual({
            sections: []
          });

          /**
           * scope: default section
           * action: click to the push button
           * expected: a section with default values
           */
          field.fields.sections.pushButton.trigger();
          expect(field.value).toEqual({
            sections: [
              { type: TypeSchema.default, value: ValueSchema.default }
            ]
          });
        }
      }
    }
  });
});
