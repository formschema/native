import { Parser } from '@/parsers/Parser';
import { EnumParser } from '@/parsers/EnumParser';
import { ListUIDescriptor } from '@/descriptors/ListUIDescriptor';
import { ParserOptions } from '@/types';
import { TestParser, Scope } from '../../lib/TestParser';

import '@/parsers';

describe('parsers/EnumParser', () => {
  const options: ParserOptions<unknown, any> = {
    schema: {
      type: 'string',
      enum: ['jon', 'arya', 'bran', 'ned']
    },
    model: 'jon'
  };

  const parser = new EnumParser(options);

  parser.parse();

  TestParser.Case({
    case: '1.0',
    description: 'parser.reset()',
    given: {
      parser: new EnumParser({
        schema: {
          type: 'string',
          enum: ['jon', 'arya', 'bran', 'ned']
        },
        model: 'jon'
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('enum'),
        field: {
          value: 'jon',
          children({ value }: Scope) {
            // children should be defined
            const models = parser.field.children.map(({ value }) => value);

            expect(models).toEqual(['jon', 'arya', 'bran', 'ned']);

            // children's field.attrs.checked should be defined
            const checkStates = parser.field.children.map(({ attrs }) => attrs.checked);

            expect(checkStates).toEqual([true, false, false, false]);
          },
          setValue({ parser }: Scope<EnumParser>) {
            // field.value should be equal to the updated value using field.setValue()
            parser.field.setValue('arya');
            expect(parser.field.value).toBe('arya');

            // field.attrs.checked should be updated when using field.setValue()
            parser.field.setValue('bran');

            const checkStates = parser.field.children.map(({ attrs }) => attrs.checked);

            expect(checkStates).toEqual([false, false, true, false]);

            // field.value should be updated when a child is checked
            const childField: any = parser.field.children.slice(-1).pop();

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
          enum: ['jon', 'arya', 'tyrion'],
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
        schema: { type: 'string', enum: ['jon', 'arya'] },
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
    description: 'field.children should be equal to an empty array with missing schema.enum',
    given: {
      parser: new EnumParser({
        schema: { type: 'string' },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          children: ({ value }: Scope) => expect(value).toEqual([])
        }
      }
    }
  });

  TestParser.Case({
    case: '2.3',
    description: 'field.children should be defined with provided field.descriptor.items',
    given: {
      parser: new EnumParser({
        schema: {
          type: 'string',
          enum: ['jon', 'arya']
        },
        model: 'jon'
      }),
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
    },
    expected: {
      parser: {
        children: [
          {
            value: ({ value }: Scope) => expect(value).toBe('jon')
          },
          {
            value: ({ value }: Scope) => expect(value).toBe('arya')
          }
        ],
        field: {
          children: [
            {
              value: ({ value }: Scope) => expect(value).toBe('jon')
            },
            {
              value: ({ value }: Scope) => expect(value).toBe('arya')
            }
          ]
        }
      },
      descriptor: {
        children: [
          {
            label: ({ value }: Scope) => expect(value).toBe('Jon Snow'),
            field: {
              value: ({ value }: Scope) => expect(value).toBe('jon')
            }
          },
          {
            label: ({ value }: Scope) => expect(value).toBe('Arya Stark'),
            field: {
              value: ({ value }: Scope) => expect(value).toBe('arya')
            }
          }
        ]
      }
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = 'arya';
        const onChange = jest.fn();
        const parser = new EnumParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          const onChange: any = parser.options.onChange;
          const expected = [
            'arya',
            'jon'
          ];

          expect(parser.rawValue).toEqual('arya');
          expect(parser.model).toEqual('arya');
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

          parser.field.children[0].setValue(true);

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
      parser() {
        const model = 'arya';
        const onChange = jest.fn();
        const parser = new EnumParser({ ...options, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          const onChange: any = parser.options.onChange;

          expect(parser.rawValue).toEqual('arya');
          expect(parser.model).toEqual('arya');
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual('arya');

          parser.field.children[0].setValue(true);

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
