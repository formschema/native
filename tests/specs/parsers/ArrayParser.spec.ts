import { ArrayField } from '@/types';
import { ArrayParser } from '@/parsers/ArrayParser';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { TestParser } from '../../lib/TestParser';

import '@/parsers';

describe('parsers/ArrayParser', () => {
  TestParser.Case({
    case: '0',
    parser: new ArrayParser({
      schema: { type: 'array' },
      model: [],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      kind: 'array',
      items: [],
      additionalItems: undefined,
      minItems: 0,
      maxItems: undefined,
      max: -2,
      count: 0,
      model: [],
      rawValue: [],
      limit: 0,
      children: [],
      field: {
        sortable: false,
        pushButton: {
          label: '+',
          disabled: true
        }
      }
    }
  });

  TestParser.Case({
    case: '1.0',
    parser: new ArrayParser({
      schema: { type: 'array' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      initialValue: [],
      model: [],
      rawValue: []
    }
  });

  TestParser.Case({
    case: '1.1',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: { type: 'string' },
        default: ['arya']
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      initialValue: ['arya'],
      model: ['arya'],
      rawValue: ['arya'],
      field: {
        sortable: true
      }
    }
  });

  TestParser.Case({
    case: '1.2',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: { type: 'string', default: 'tyrion' },
        minItems: 1
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      initialValue: [],
      model: ['tyrion'],
      rawValue: ['tyrion']
    }
  });

  TestParser.Case({
    case: '1.3',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: undefined,
      required: true,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      initialValue: [],
      model: [],
      rawValue: [undefined]
    }
  });

  TestParser.Case({
    case: '2',
    parser: new ArrayParser({
      schema: { type: 'array' },
      model: [12],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [],
      additionalItems: undefined,
      minItems: 0,
      maxItems: undefined,
      max: -2,
      get count() {
        return this.rawValue.length;
      },
      model: [12],
      rawValue: [12],
      limit: 0,
      children: [],
      field: {
        uniqueItems: undefined,
        pushButton: {
          disabled: true
        }
      }
    }
  });

  TestParser.Case({
    case: '3',
    description: 'with options.required === true',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: [
          { type: 'string' }
        ]
      },
      model: [],
      required: true,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [{ type: 'string' }],
      additionalItems: undefined,
      minItems: 1,
      maxItems: undefined,
      max: 1,
      count: 1,
      model: [],
      rawValue: [undefined],
      limit: 1,
      children({ length }: ArrayField[]) {
        expect(length).toBe(this.limit);
      },
      field: {
        required: true,
        uniqueItems: undefined,
        sortable: false,
        pushButton: {
          disabled: true
        }
      }
    }
  });

  const options4: any = {
    schema: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 2,
      uniqueItems: true
    },
    model: [],
    descriptorConstructor: NativeDescriptor.get
  };

  TestParser.Case({
    case: '4.0',
    parser: new ArrayParser(options4),
    expected: {
      items: [
        { type: 'string' }
      ],
      additionalItems: undefined,
      minItems: 1,
      maxItems: 2,
      get max() {
        return this.maxItems;
      },
      count: 1,
      model: [],
      rawValue: [undefined],
      get limit() {
        return this.count;
      },
      children({ length }: ArrayField[]) {
        expect(length).toBe(this.limit);
      },
      field: {
        uniqueItems: undefined,
        pushButton: {
          disabled: false
        }
      }
    }
  });

  TestParser.Case({
    case: '4.1',
    parser() {
      const parser = new ArrayParser(options4);

      parser.parse();
      parser.field.pushButton.trigger();

      return parser;
    },
    expected: {
      count: 2,
      model: [],
      rawValue: [undefined, undefined],
      get limit() {
        return this.count;
      },
      children({ length }: ArrayField[]) {
        expect(length).toBe(this.limit);
      },
      field: {
        pushButton: {
          disabled: true
        }
      }
    }
  });

  TestParser.Case({
    case: '4.2',
    description: 'field.pushButton.trigger()',
    parser() {
      const parser = new ArrayParser(options4);

      parser.parse();

      // call field.pushButton.trigger() twice
      parser.field.pushButton.trigger();
      parser.field.pushButton.trigger();

      return parser;
    },
    expected: {
      count: 2,
      model: [],
      rawValue: [undefined, undefined],
      get limit() {
        return this.count;
      },
      children({ length }: ArrayField[]) {
        expect(length).toBe(this.limit);
      },
      field: {
        pushButton: {
          disabled: true
        }
      }
    }
  });

  const options5: any = {
    schema: {
      type: 'array',
      items: { type: 'string', enum: ['a', 'b', 'c', 'd'] },
      uniqueItems: true
    },
    model: ['b', 'd'],
    descriptorConstructor: NativeDescriptor.get
  };

  TestParser.Case({
    case: '5.0',
    description: 'with array enums (checkbox)',
    parser: new ArrayParser(options5),
    expected: {
      items: [
        { type: 'string', default: 'a', title: 'a' },
        { type: 'string', default: 'b', title: 'b' },
        { type: 'string', default: 'c', title: 'c' },
        { type: 'string', default: 'd', title: 'd' }
      ],
      additionalItems: undefined,
      minItems: 0,
      maxItems: 4,
      max: 4,
      count: 4,
      model: ['b', 'd'],
      rawValue: [undefined, 'b', undefined, 'd'],
      limit: 4,
      children: ({ length }: ArrayField[]) => expect(length).toBe(4),
      field: {
        required: false,
        uniqueItems: true,
        // attrs: {
        //   input: {
        //     type: 'checkbox'
        //   }
        // },
        pushButton: {
          disabled: true
        }
      }
    }
  });

  TestParser.Case({
    case: '5.1',
    description: 'with custom descriptor',
    parser: new ArrayParser({
      ...options5,
      descriptor: {
        items: [
          {
            label: 'label-a',
            helper: 'description-a'
          },
          {
            label: 'label-b',
            helper: 'description-b'
          },
          {
            label: 'label-c',
            helper: 'description-c'
          },
          {
            label: 'label-d',
            helper: 'description-d'
          }
        ]
      }
    }),
    expected: {
      children: (fields: ArrayField[]) => fields.forEach(({ descriptor }: ArrayField, i) => {
        const label = `label-${options5.schema.items.enum[i]}`;
        const description = `description-${options5.schema.items.enum[i]}`;

        expect(descriptor.label).toBe(label);
        expect(descriptor.helper).toBe(description);
      })
    }
  });

  TestParser.Case({
    case: '5.2',
    description: 'with updated checkbox input',
    parser: () => {
      const parser = new ArrayParser(options5);

      parser.parse();
      parser.field.children[0].input.setValue(true);

      return parser;
    },
    expected: {
      model: ['a', 'b', 'd'],
      rawValue: ['a', 'b', undefined, 'd']
    }
  });

  TestParser.Case({
    case: '6',
    description: 'with min/max and default model',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: { type: 'string' },
        minItems: 3,
        maxItems: 4
      },
      model: ['a', 'd'],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [
        { type: 'string' }
      ],
      additionalItems: undefined,
      minItems: 3,
      maxItems: 4,
      max: 4,
      count: 3,
      model: ['a', 'd'],
      rawValue: ['a', 'd', undefined],
      limit(value: number) {
        expect(value).toBe(this.count);
      },
      children: ({ length }: ArrayField[]) => expect(length).toBe(3),
      field: {
        uniqueItems: undefined,
        pushButton: {
          disabled: false
        }
      }
    }
  });

  TestParser.Case({
    case: '7.0',
    description: 'with additional items',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: [
          { type: 'string' }
        ],
        additionalItems: { type: 'number' }
      },
      model: ['a', 12],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [
        { type: 'string' }
      ],
      additionalItems: { type: 'number' },
      minItems: 0,
      maxItems: undefined,
      max: -1,
      count() {
        return this.rawValue.length;
      },
      model: ['a', 12],
      rawValue: ['a', 12],
      limit(value: number) {
        expect(value).toBe(this.items.length);
      },
      children({ length }: ArrayField[]) {
        expect(length).toBe(this.rawValue.length);
      },
      field: {
        required: false,
        uniqueItems: undefined,
        pushButton: {
          disabled: false
        }
      }
    }
  });

  TestParser.Case({
    case: '7.1',
    description: 'with an undefined schema type',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: [
          { type: 'string' }
        ],
        additionalItems: { type: undefined } as any
      },
      model: ['a', 12],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [
        { type: 'string' }
      ],
      additionalItems: { type: undefined },
      children({ length }: ArrayField[]) {
        expect(length).toBe(this.items.length);
      }
    }
  });

  const options8: any = (bracketedObjectInputNameValue: boolean) => ({
    name: 'array',
    schema: {
      type: 'array',
      items: { type: 'string' }
    },
    model: ['a', 12],
    descriptorConstructor: NativeDescriptor.get,
    bracketedObjectInputName: bracketedObjectInputNameValue
  });

  TestParser.Case({
    case: '8.0',
    description: 'with name and bracketedObjectInputName === true',
    parser: new ArrayParser(options8(true)),
    expected: {
      children(items: ArrayField[]) {
        items.forEach(({ name }) => expect(name).toBe('array[]'));
      }
    }
  });

  TestParser.Case({
    case: '8.1',
    description: 'with name and bracketedObjectInputName === false',
    parser: new ArrayParser(options8(false)),
    expected: {
      children(items: ArrayField[]) {
        items.forEach(({ name }) => expect(name).toBe('array'));
      }
    }
  });

  TestParser.Case({
    case: '9.0',
    description: 'isEmpty() with an empty array',
    parser: new ArrayParser({
      schema: { type: 'array' },
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function) => expect(fn([])).toBeTruthy()
    }
  });

  TestParser.Case({
    case: '9.1',
    description: 'isEmpty() with a non empty array',
    parser: new ArrayParser({
      schema: { type: 'array' },
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function) => expect(fn([1])).toBeFalsy()
    }
  });

  TestParser.Case({
    case: '9.2',
    description: 'isEmpty() with default value',
    parser: new ArrayParser({
      schema: { type: 'array', default: [2] },
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      isEmpty: (fn: Function, parser: ArrayParser) => expect(fn.apply(parser)).toBeFalsy()
    }
  });

  TestParser.Case({
    case: '10',
    description: 'field.deep validation',
    parser: new ArrayParser(options8(true)),
    expected: {
      field: {
        deep: (value: number) => expect(value).toBe(0),
        children: (values: ArrayField[]) => values.forEach(({ deep }) => expect(deep).toBe(1))
      }
    }
  });

  TestParser.Case({
    case: '11.0',
    description: 'parser.reset()',
    parser: () => {
      const model = ['arya'];
      const onChange = jest.fn();
      const parser = new ArrayParser({ ...options4, model, onChange });

      parser.parse();

      return parser;
    },
    expected: {
      reset(fn: Function, parser: any) {
        const onChange = parser.options.onChange;
        const expected = [
          ['arya'],
          ['jon']
        ];

        expect(parser.rawValue).toEqual(['arya']);
        expect(parser.model).toEqual(['arya']);
        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

        parser.field.children[0].input.setValue('jon');

        expect(onChange.mock.calls.length).toBe(2);
        expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
        expect(parser.rawValue).toEqual(['jon']);
        expect(parser.model).toEqual(['jon']);

        parser.reset(); // reset without calling onChange

        expect(onChange.mock.calls.length).toBe(2);
        expect(parser.initialValue).toEqual(['arya']);
        expect(parser.rawValue).toEqual(['arya']);
        expect(parser.model).toEqual(['arya']);

        parser.field.input.reset(); // reset with calling onChange

        expect(onChange.mock.calls.length).toBe(3);
        expect(onChange.mock.calls[2][0]).toEqual(expected[0]);
      }
    }
  });
});
