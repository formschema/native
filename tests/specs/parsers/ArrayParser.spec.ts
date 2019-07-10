import { ArrayParser } from '@/parsers/ArrayParser';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { TestCaseParser } from '../../lib/TestCaseParser';

import '@/parsers';

const Test = new TestCaseParser(ArrayParser);

describe('parsers/ArrayParser', () => {
  Test.Case({
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
      minItems: 1,
      maxItems: undefined,
      max: -2,
      count: 1,
      model: [],
      rawValue: [],
      limit: 0,
      children: [],
      field: {
        buttons: {
          add: {
            disabled: true
          }
        }
      }
    }
  });

  Test.Case({
    case: '1.0',
    parser: new ArrayParser({
      schema: { type: 'array' },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      initialValue: undefined,
      model: [],
      rawValue: []
    }
  });

  Test.Case({
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
      rawValue: ['arya']
    }
  });

  Test.Case({
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
      initialValue: undefined,
      model: ['tyrion'],
      rawValue: ['tyrion']
    }
  });

  Test.Case({
    case: '1.3',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: undefined,
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      initialValue: undefined,
      model: [],
      rawValue: [undefined]
    }
  });

  Test.Case({
    case: '2',
    parser: new ArrayParser({
      schema: { type: 'array' },
      model: [12],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [],
      additionalItems: undefined,
      minItems: 1,
      maxItems: undefined,
      max: -2,
      count: 1,
      model: [12],
      rawValue: [12],
      limit: 0,
      children: [],
      field: {
        uniqueItems: undefined,
        buttons: {
          add: {
            disabled: true
          }
        }
      }
    }
  });

  Test.Case({
    case: '3',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: [
          { type: 'string' }
        ]
      },
      model: [],
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
      children: ({ length }: any) => length === 1,
      field: {
        required: true,
        uniqueItems: undefined,
        buttons: {
          add: {
            disabled: true
          }
        }
      }
    }
  });

  Test.Case({
    case: '4',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 3,
        uniqueItems: true
      },
      model: [],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [
        { type: 'string' }
      ],
      additionalItems: undefined,
      minItems: 1,
      maxItems: 3,
      get max() {
        return this.maxItems;
      },
      count: 1,
      model: [],
      rawValue: [undefined],
      get limit() {
        return this.count;
      },
      children: ({ length }: any) => length === 1,
      field: {
        uniqueItems: undefined,
        buttons: {
          add: {
            disabled: false
          }
        }
      }
    }
  });

  Test.Case({
    case: '5',
    parser: new ArrayParser({
      schema: {
        type: 'array',
        items: { type: 'string', enum: ['a', 'b', 'c', 'd'] },
        uniqueItems: true
      },
      model: ['a', 'd'],
      descriptorConstructor: NativeDescriptor.get
    }),
    expected: {
      items: [
        { type: 'string', default: 'a', title: 'a' },
        { type: 'string', default: 'b', title: 'b' },
        { type: 'string', default: 'c', title: 'c' },
        { type: 'string', default: 'd', title: 'd' }
      ],
      additionalItems: undefined,
      minItems: 1,
      maxItems: 4,
      max: 4,
      count: 4,
      model: ['a', 'd'],
      rawValue: ['a', undefined, undefined, 'd'],
      limit: 4,
      children: ({ length }: any) => length === 4,
      field: {
        uniqueItems: true,
        // attrs: {
        //   input: {
        //     type: 'checkbox'
        //   }
        // },
        buttons: {
          add: {
            disabled: true
          }
        }
      }
    }
  });

  Test.Case({
    case: '6',
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
      get limit() {
        return this.count;
      },
      children: ({ length }: any) => length === 3,
      field: {
        uniqueItems: undefined,
        buttons: {
          add: {
            disabled: false
          }
        }
      }
    }
  });

  Test.Case({
    case: '7',
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
      minItems: 1,
      maxItems: undefined,
      max: -1,
      count() {
        return this.rawValue.length;
      },
      model: ['a', 12],
      rawValue: ['a', 12],
      get limit() {
        return this.items.length;
      },
      children: ({ length }: any) => length === 2,
      field: {
        uniqueItems: undefined,
        buttons: {
          add: {
            disabled: false
          }
        }
      }
    }
  });
});
