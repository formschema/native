import { EnumParser } from '@/parsers/EnumParser';
import { TestParser, Scope } from '../../lib/TestParser';

import '@/parsers';

describe('parsers/EnumParser', () => {
  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    given: {
      parser: new EnumParser({
        schema: {
          type: 'string',
          enum: [ 'jon', 'arya', 'bran', 'ned' ]
        },
        model: 'jon'
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('enum'),
        field: {
          value: 'jon',
          fields({ parser }: Scope) {
            // fields should be defined
            const models = Object.keys(parser.field.fields);

            expect(models).toEqual([ 'jon', 'arya', 'bran', 'ned' ]);

            // fields's field.attrs.checked should be defined
            const checkStates = models.map((key) => parser.field.fields[key].attrs.checked);

            expect(checkStates).toEqual([ true, false, false, false ]);
          },
          setValue({ parser }: Scope<EnumParser>) {
            // field.value should be equal to the updated value using field.setValue()
            parser.field.setValue('arya');
            expect(parser.field.value).toBe('arya');

            // field.attrs.checked should be updated when using field.setValue()
            parser.field.setValue('bran');

            const models = Object.keys(parser.field.fields);
            const checkStates = models.map((key) => parser.field.fields[key].attrs.checked);

            expect(checkStates).toEqual([ false, false, true, false ]);

            // field.value should be updated when a child is checked
            const childField: any = parser.field.fields[models.slice(-1).pop() as any];

            childField.setValue(childField.value);
            expect(parser.field.value).toBe('ned');
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'should successfully parse default value',
    given: {
      parser: new EnumParser({
        schema: {
          type: 'string',
          enum: [ 'jon', 'arya', 'tyrion' ],
          default: 'arya'
        },
        model: undefined
      })
    },
    expected: {
      parser: {
        model: ({ value }: Scope) => expect(value).toBe('arya'),
        field: {
          value: ({ value }: Scope) => expect(value).toBe('arya')
        }
      }
    }
  });

  TestParser.Case({
    case: '2.1',
    description: 'field.value should parse default undefined as an undefined model',
    given: {
      parser: new EnumParser({
        schema: { type: 'string', enum: [ 'jon', 'arya' ] },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          value: ({ value }: Scope) => expect(value).toBeUndefined()
        }
      }
    }
  });

  TestParser.Case({
    case: '2.2',
    description: 'field.fields should be empty with missing schema.enum',
    given: {
      parser: new EnumParser({
        schema: { type: 'string' },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          fields: ({ value }: Scope) => expect(value).toEqual({})
        }
      }
    }
  });

  TestParser.Case({
    case: '2.3',
    description: 'field.fields should be defined with provided field.descriptor.items',
    given: {
      parser: new EnumParser({
        schema: {
          type: 'string',
          enum: [ 'jon', 'arya' ]
        },
        model: 'jon',
        descriptor: {
          items: {
            jon: {
              label: 'Jon Snow'
            },
            arya: {
              label: 'Arya Stark'
            }
          }
        }
      })
    },
    expected: {
      parser: {
        fields: {
          jon: {
            value: ({ value }: Scope) => expect(value).toBe('jon')
          },
          arya: {
            value: ({ value }: Scope) => expect(value).toBe('arya')
          }
        },
        field: {
          fields: {
            jon: {
              value: ({ value }: Scope) => expect(value).toBe('jon')
            },
            arya: {
              value: ({ value }: Scope) => expect(value).toBe('arya')
            }
          },
          descriptor: {
            children: [
              {
                label: ({ value }: Scope) => expect(value).toBe('Jon Snow')
              },
              {
                label: ({ value }: Scope) => expect(value).toBe('Arya Stark')
              }
            ]
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'parser.reset()',
    given: {
      parser: new EnumParser({
        schema: {
          type: 'string',
          enum: [ 'jon', 'arya', 'bran', 'ned' ]
        },
        model: 'arya',
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          const onChange = parser.options.onChange;
          const expected = [
            'arya',
            'jon'
          ];

          expect(parser.rawValue).toEqual('arya');
          expect(parser.model).toEqual('arya');
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

          parser.field.fields.jon.setValue(true);

          expect(onChange.mock.calls.length).toBe(2);
          expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
          expect(parser.rawValue).toEqual('jon');
          expect(parser.model).toEqual('jon');

          parser.reset(); // reset without calling onChange

          expect(onChange.mock.calls.length).toBe(2);
          expect(parser.initialValue).toEqual('arya');
          expect(parser.rawValue).toEqual('arya');
          expect(parser.model).toEqual('arya');

          parser.field.reset(); // reset with calling onChange

          expect(onChange.mock.calls.length).toBe(3);
          expect(onChange.mock.calls[2][0]).toEqual(expected[0]);
        }
      }
    }
  });

  TestParser.Case({
    case: '4.0',
    description: 'parser.clear()',
    given: {
      parser: new EnumParser({
        schema: {
          type: 'string',
          enum: [ 'jon', 'arya', 'bran', 'ned' ]
        },
        model: 'arya',
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          const onChange = parser.options.onChange;

          expect(parser.rawValue).toEqual('arya');
          expect(parser.model).toEqual('arya');
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual('arya');

          parser.field.fields.jon.setValue(true);

          expect(onChange.mock.calls.length).toBe(2);
          expect(onChange.mock.calls[1][0]).toEqual('jon');
          expect(parser.rawValue).toEqual('jon');
          expect(parser.model).toEqual('jon');

          parser.clear(); // clear without calling onChange

          expect(onChange.mock.calls.length).toBe(2);
          expect(parser.rawValue).toEqual(undefined);
          expect(parser.model).toEqual(undefined);

          parser.field.clear(); // clear with calling onChange

          expect(onChange.mock.calls.length).toBe(3);
          expect(onChange.mock.calls[2][0]).toEqual(undefined);
        }
      }
    }
  });
});
