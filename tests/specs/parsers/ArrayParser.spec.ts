import { ArrayField } from '@/types';
import { ArrayParser } from '@/parsers/ArrayParser';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/ArrayParser', () => {
  TestParser.Case({
    case: '0',
    given: {
      parser: new ArrayParser({
        schema: { type: 'array' },
        model: []
      })
    },
    expected: {
      parser: {
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
            disabled: true
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '1.0',
    given: {
      parser: new ArrayParser({
        schema: { type: 'array' },
        model: undefined
      })
    },
    expected: {
      parser: {
        initialValue: [],
        model: [],
        rawValue: []
      }
    }
  });

  TestParser.Case({
    case: '1.1',
    given: {
      parser: new ArrayParser({
        schema: {
          type: 'array',
          items: { type: 'string' },
          default: ['arya']
        },
        model: undefined
      })
    },
    expected: {
      parser: {
        initialValue: ['arya'],
        model: ['arya'],
        rawValue: ['arya'],
        field: {
          sortable: true
        }
      }
    }
  });

  TestParser.Case({
    case: '1.2',
    given: {
      parser: new ArrayParser({
        schema: {
          type: 'array',
          items: { type: 'string', default: 'tyrion' },
          minItems: 1
        },
        model: undefined
      })
    },
    expected: {
      parser: {
        initialValue: [],
        model: ['tyrion'],
        rawValue: ['tyrion']
      }
    }
  });

  TestParser.Case({
    case: '1.3',
    given: {
      parser: new ArrayParser({
        schema: {
          type: 'array',
          items: { type: 'string' }
        },
        model: undefined,
        required: true
      })
    },
    expected: {
      parser: {
        initialValue: [],
        model: [],
        rawValue: [undefined]
      }
    }
  });

  TestParser.Case({
    case: '2',
    given: {
      parser: new ArrayParser({
        schema: { type: 'array' },
        model: [12]
      })
    },
    expected: {
      parser: {
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
    }
  });

  TestParser.Case({
    case: '3',
    description: 'with options.required === true',
    given: {
      parser: new ArrayParser({
        schema: {
          type: 'array',
          items: [
            { type: 'string' }
          ]
        },
        model: [],
        required: true
      })
    },
    expected: {
      parser: {
        items: [{ type: 'string' }],
        additionalItems: undefined,
        minItems: 1,
        maxItems: undefined,
        max: 1,
        count: 1,
        model: [],
        rawValue: [undefined],
        limit: 1,
        children({ value }: Scope) {
          expect(value.length).toBe(this.limit);
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
    model: []
  };

  TestParser.Case({
    case: '4.0',
    given: {
      parser: new ArrayParser(options4)
    },
    expected: {
      parser: {
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
        children({ value }: Scope) {
          expect(value.length).toBe(this.limit);
        },
        field: {
          uniqueItems: undefined,
          pushButton: {
            disabled: false
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '4.1',
    given: {
      parser() {
        const parser = new ArrayParser(options4);

        parser.parse();
        parser.field.pushButton.trigger();

        return parser;
      }
    },
    expected: {
      parser: {
        count: 2,
        model: [],
        rawValue: [undefined, undefined],
        get limit() {
          return this.count;
        },
        children({ value }: Scope) {
          expect(value.length).toBe(this.limit);
        },
        field: {
          pushButton: {
            disabled: true
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '4.2',
    description: 'field.pushButton.trigger()',
    given: {
      parser() {
        const parser = new ArrayParser(options4);

        parser.parse();

        // call field.pushButton.trigger() twice
        parser.field.pushButton.trigger();
        parser.field.pushButton.trigger();

        return parser;
      }
    },
    expected: {
      parser: {
        count: 2,
        model: [],
        rawValue: [undefined, undefined],
        get limit() {
          return this.count;
        },
        children({ value }: Scope) {
          expect(value.length).toBe(this.limit);
        },
        field: {
          pushButton: {
            disabled: true
          }
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
    model: ['b', 'd']
  };

  TestParser.Case({
    case: '5.0',
    description: 'with array enums (checkbox)',
    given: {
      parser: new ArrayParser(options5)
    },
    expected: {
      parser: {
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
        children: ({ value }: Scope) => expect(value.length).toBe(4),
        field: {
          required: false,
          uniqueItems: true,
          children: ({ value: [ field0 ] }: Scope) => {
            // expect(field0.descriptor.kind).toBe('checkbox');
            expect(field0.attrs.type).toBe('checkbox');
          },
          pushButton: {
            disabled: true
          }
        }
      },
      descriptor: {
        kind: 'array'
      }
    }
  });

  // TestParser.Case({
  //   case: '5.1',
  //   description: 'with custom descriptor',
  //   parser: new ArrayParser({
  //     ...options5,
  //     descriptor: {
  //       items: [
  //         {
  //           label: 'label-a',
  //           helper: 'description-a'
  //         },
  //         {
  //           label: 'label-b',
  //           helper: 'description-b'
  //         },
  //         {
  //           label: 'label-c',
  //           helper: 'description-c'
  //         },
  //         {
  //           label: 'label-d',
  //           helper: 'description-d'
  //         }
  //       ]
  //     }
  //   }),
  //   expected: {
  //     children: (fields: ArrayField[]) => fields.forEach(({ descriptor }: ArrayField, i) => {
  //       const label = `label-${options5.schema.items.enum[i]}`;
  //       const description = `description-${options5.schema.items.enum[i]}`;

  //       expect(descriptor.label).toBe(label);
  //       expect(descriptor.helper).toBe(description);
  //     })
  //   }
  // });

  TestParser.Case({
    case: '5.2',
    description: 'with updated checkbox input',
    given: {
      parser() {
        const parser = new ArrayParser(options5);

        parser.parse();
        parser.field.children[0].setValue(true);

        return parser;
      }
    },
    expected: {
      parser: {
        model: ['a', 'b', 'd'],
        rawValue: ['a', 'b', undefined, 'd']
      }
    }
  });

  TestParser.Case({
    case: '6',
    description: 'with min/max and default model',
    given: {
      parser: new ArrayParser({
        schema: {
          type: 'array',
          items: { type: 'string' },
          minItems: 3,
          maxItems: 4
        },
        model: ['a', 'd']
      })
    },
    expected: {
      parser: {
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
        limit({ value }: Scope) {
          expect(value).toBe(this.count);
        },
        children: ({ value }: Scope) => expect(value.length).toBe(3),
        field: {
          uniqueItems: undefined,
          pushButton: {
            disabled: false
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '7.0',
    description: 'with additional items',
    given: {
      parser: new ArrayParser({
        schema: {
          type: 'array',
          items: [
            { type: 'string' }
          ],
          additionalItems: { type: 'number' }
        },
        model: ['a', 12]
      })
    },
    expected: {
      parser: {
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
        limit({ value }: Scope) {
          expect(value).toBe(this.items.length);
        },
        children({ value }: Scope) {
          expect(value.length).toBe(this.rawValue.length);
        },
        field: {
          required: false,
          uniqueItems: undefined,
          pushButton: {
            disabled: false
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '7.1',
    description: 'with an undefined schema type',
    given: {
      parser: new ArrayParser({
        schema: {
          type: 'array',
          items: [
            { type: 'string' }
          ],
          additionalItems: { type: undefined } as any
        },
        model: ['a', 12]
      })
    },
    expected: {
      parser: {
        items: [
          { type: 'string' }
        ],
        additionalItems: { type: undefined },
        children({ value }: Scope) {
          expect(value.length).toBe(this.items.length);
        }
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
    bracketedObjectInputName: bracketedObjectInputNameValue
  });

  TestParser.Case({
    case: '8.0',
    description: 'with name and bracketedObjectInputName === true',
    given: {
      parser: new ArrayParser(options8(true))
    },
    expected: {
      parser: {
        children({ value: items }: Scope) {
          items.forEach(({ name }: any) => expect(name).toBe('array[]'));
        }
      }
    }
  });

  TestParser.Case({
    case: '8.1',
    description: 'with name and bracketedObjectInputName === false',
    given: {
      parser: new ArrayParser(options8(false))
    },
    expected: {
      parser: {
        children({ value: items }: Scope) {
          items.forEach(({ name }: any) => expect(name).toBe('array'));
        }
      }
    }
  });

  TestParser.Case({
    case: '9.0',
    description: 'isEmpty() with an empty array',
    given: {
      parser: new ArrayParser({
        schema: { type: 'array' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty([])).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '9.1',
    description: 'isEmpty() with a non empty array',
    given: {
      parser: new ArrayParser({
        schema: { type: 'array' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty([1])).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '9.2',
    description: 'isEmpty() with default value',
    given: {
      parser: new ArrayParser({
        schema: { type: 'array', default: [2] }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty()).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '10',
    description: 'field.deep validation',
    given: {
      parser: new ArrayParser(options8(true))
    },
    expected: {
      parser: {
        field: {
          deep: ({ value }: Scope) => expect(value).toBe(0),
          children({ value }: Scope) {
            value.forEach(({ deep }: any) => expect(deep).toBe(1));
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '11.0',
    description: 'parser.reset()',
    given: {
      parser() {
        const model = ['arya'];
        const onChange = jest.fn();
        const parser = new ArrayParser({ ...options4, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          const onChange: any = parser.options.onChange;
          const expected = [
            ['arya'],
            ['jon']
          ];

          expect(parser.rawValue).toEqual(['arya']);
          expect(parser.model).toEqual(['arya']);
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

          parser.field.children[0].setValue('jon');

          expect(onChange.mock.calls.length).toBe(2);
          expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
          expect(parser.rawValue).toEqual(['jon']);
          expect(parser.model).toEqual(['jon']);

          parser.reset(); // reset without calling onChange

          expect(onChange.mock.calls.length).toBe(2);
          expect(parser.initialValue).toEqual(['arya']);
          expect(parser.rawValue).toEqual(['arya']);
          expect(parser.model).toEqual(['arya']);

          parser.field.reset(); // reset with calling onChange

          expect(onChange.mock.calls.length).toBe(3);
          expect(onChange.mock.calls[2][0]).toEqual(expected[0]);
        }
      }
    }
  });

  TestParser.Case({
    case: '12.0',
    description: 'parser.clear()',
    given: {
      parser() {
        const model = ['arya'];
        const onChange = jest.fn();
        const parser = new ArrayParser({ ...options4, model, onChange });

        parser.parse();

        return parser;
      }
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          const onChange: any = parser.options.onChange;
          const expected = [
            ['arya'],
            ['jon']
          ];

          expect(parser.rawValue).toEqual(['arya']);
          expect(parser.model).toEqual(['arya']);
          expect(onChange.mock.calls.length).toBe(1);
          expect(onChange.mock.calls[0][0]).toEqual(expected[0]);

          parser.field.children[0].setValue('jon');

          expect(onChange.mock.calls.length).toBe(2);
          expect(onChange.mock.calls[1][0]).toEqual(expected[1]);
          expect(parser.rawValue).toEqual(['jon']);
          expect(parser.model).toEqual(['jon']);

          parser.clear(); // clear without calling onChange

          expect(onChange.mock.calls.length).toBe(2);
          expect(parser.initialValue).toEqual(['arya']);
          expect(parser.rawValue).toEqual([undefined]);
          expect(parser.model).toEqual([]);

          parser.field.clear(); // clear with calling onChange

          expect(onChange.mock.calls.length).toBe(3);
          expect(onChange.mock.calls[2][0]).toEqual([]);
        }
      }
    }
  });
});
