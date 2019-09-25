import { BooleanParser } from '@/parsers/BooleanParser';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/BooleanParser', () => {
  TestParser.Case({
    case: '0.0',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' },
        model: undefined
      })
    },
    expected: {
      parser: {
        field: {
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('checkbox'),
            checked: ({ value }: Scope) => expect(value).toBeFalsy()
          },
          value: ({ value }: Scope) => expect(value).toBeFalsy()
        }
      }
    }
  });

  it('should successfully parse default truthy boolean value', () => {
    const parser = new BooleanParser({
      schema: { type: 'boolean' },
      model: true
    });

    parser.parse();

    expect(parser.field.value).toBeTruthy();
  });

  it('field.value should successfully parse default falsy boolean value', () => {
    const parser = new BooleanParser({
      schema: { type: 'boolean' },
      model: false
    });

    parser.parse();

    expect(parser.field.value).toBeFalsy();
  });

  it('field.value should parse default non boolean value as a falsy model', () => {
    const parser = new BooleanParser({
      schema: { type: 'boolean' },
      model: 12 as any
    });

    parser.parse();

    expect(parser.field.value).toBeFalsy();
  });

  TestParser.Case({
    case: '1.0',
    description: 'isEmpty() with non boolean',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty('false')).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '1.1',
    description: 'isEmpty() with a falsy boolean',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty(false)).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '1.2',
    description: 'isEmpty() with a truthy boolean',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty(true)).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '1.3',
    description: 'isEmpty() with default value',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean', default: true }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty()).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '1.4',
    description: 'isEmpty() with non boolean value',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' }
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty(null)).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'parser.reset()',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' },
        model: true,
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          expect(parser.rawValue).toBe(true);
          expect(parser.model).toBe(true);

          parser.field.setValue(false);

          expect(parser.rawValue).toBe(false);
          expect(parser.model).toBe(false);

          parser.reset(); // reset without calling onChange()

          expect(parser.rawValue).toBe(true);
          expect(parser.model).toBe(true);

          parser.field.reset(); // reset with calling onChange()

          const { onChange } = parser.options;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ true, false, true ]);
        }
      }
    }
  });

  TestParser.Case({
    case: '3.0',
    description: 'parser.clear()',
    given: {
      parser: new BooleanParser({
        schema: { type: 'boolean' },
        model: false,
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          expect(parser.rawValue).toBe(false);
          expect(parser.model).toBe(false);

          parser.field.setValue(true);

          expect(parser.rawValue).toBe(true);
          expect(parser.model).toBe(true);

          parser.clear(); // clear without calling onChange()

          expect(parser.rawValue).toBeFalsy();
          expect(parser.model).toBeFalsy();

          parser.field.clear(); // clear with calling onChange()

          const { onChange } = parser.options;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ false, true, false ]);
        }
      }
    }
  });
});
