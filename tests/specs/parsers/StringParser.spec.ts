import { StringParser } from '@/parsers/StringParser';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/StringParser', () => {
  TestParser.Case({
    case: '0.0',
    description: 'parser.clear()',
    given: {
      parser: new StringParser({
        schema: {
          type: 'string',
          pattern: 'arya|jon',
          minLength: 5,
          maxLength: 15
        },
        model: 'arya'
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('string'),
        field: {
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('text'),
            minlength: ({ value, options }: Scope) => expect(value).toBe(options.schema.minLength),
            maxlength: ({ value, options }: Scope) => expect(value).toBe(options.schema.maxLength),
            pattern: ({ value, options }: Scope) => expect(value).toBe(options.schema.pattern),
            value: ({ value, options }: Scope) => expect(value).toBe(`${options.model}`)
          },
          value: ({ value, options }: Scope) => expect(value).toBe(options.model)
        }
      }
    }
  });

  const formatTypes: Record<string, string> = {
    date: 'date',
    'date-time': 'datetime-local',
    email: 'email',
    'idn-email': 'email',
    time: 'time',
    uri: 'url'
  };

  Object.keys(formatTypes).forEach((format) => {
    const type = formatTypes[format];

    it(`field.attrs.type should be equal to '${type}' with schema.format === '${format}'`, () => {
      const parser = new StringParser({
        schema: { type: 'string', format },
        model: ''
      });

      parser.parse();

      expect(parser.field.attrs.type).toBe(type);
    });
  });

  it('should parse default undefined value as an undefined string', () => {
    const parser = new StringParser({
      schema: { type: 'string' },
      model: undefined
    });

    parser.parse();

    expect(parser.field.value).toBeUndefined();
  });

  it('should parse default non string value as a string', () => {
    const parser = new StringParser({
      schema: { type: 'string' },
      model: 12 as any
    });

    parser.parse();

    expect(parser.field.value).toBe('12');
  });

  TestParser.Case({
    case: '1.0: schema.contentMediaType',
    description: 'with `text/*`',
    given: {
      parser: new StringParser({
        schema: { type: 'string', contentMediaType: 'text/plain' },
        model: undefined as any
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('textarea'),
        type: ({ value }: Scope) => expect(value).toBeUndefined(),
        field: {
          kind({ value, parser }: Scope) {
            expect(value).toBe(parser.kind);
          },
          attrs: {
            accept: ({ value }: Scope) => expect(value).toBeUndefined()
          }
        },
        descriptor: {
          kind({ value, field }: Scope) {
            expect(value).toBe(field.kind);
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '1.1: schema.contentMediaType',
    description: 'with `image/*`',
    given: {
      parser: new StringParser({
        schema: { type: 'string', contentMediaType: 'image/png' },
        model: undefined as any
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('image'),
        field: {
          kind({ value, parser }: Scope) {
            expect(value).toBe(parser.kind);
          },
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('file'),
            accept({ value, parser: { options } }: Scope) {
              expect(value).toBe(options.schema.contentMediaType);
            }
          }
        },
        descriptor: {
          kind({ value, parser }: Scope) {
            expect(value).toBe(parser.field.kind);
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '1.2: schema.contentMediaType',
    description: 'with custom descriptor.kind',
    given: {
      parser: new StringParser({
        schema: { type: 'string', contentMediaType: 'audio/ogg' },
        model: undefined as any,
        descriptor: { kind: 'string' },
        get kind() {
          return this.descriptor.kind;
        }
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('string'),
        field: {
          kind({ value, parser }: Scope) {
            expect(value).toBe(parser.kind);
          },
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('text'),
            accept: ({ value }: Scope) => expect(value).toBeUndefined()
          }
        },
        descriptor: {
          kind({ value }: Scope) {
            expect(value).toBe('string');
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '1.3: schema.contentMediaType',
    description: 'any other values',
    given: {
      parser: new StringParser({
        schema: { type: 'string', contentMediaType: 'any/mime' },
        model: undefined as any
      })
    },
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('file'),
        field: {
          kind({ value, parser }: Scope) {
            expect(value).toBe(parser.kind);
          },
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('file'),
            accept({ value, parser: { options } }: Scope) {
              expect(value).toBe(options.schema.contentMediaType);
            }
          }
        },
        descriptor: {
          kind({ value, parser: { field } }: Scope) {
            expect(value).toBe(field.kind);
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '1.4: schema.contentMediaType',
    description: 'with `image/*`',
    given: {
      parser: new StringParser({
        schema: { type: 'string', contentMediaType: 'image/png' },
        model: undefined as any
      })
    },
    expected: {
      parser: {
        field: {
          kind: ({ value }: Scope) => expect(value).toBe('image'),
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('file'),
            accept({ value, parser: { options } }: Scope) {
              expect(value).toBe(options.schema.contentMediaType);
            }
          }
        },
        descriptor: {
          kind({ value, parser: { field } }: Scope) {
            expect(value).toBe(field.kind);
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '3.0: parser.isEmpty()',
    description: 'with non empty string',
    given: {
      parser: new StringParser({
        schema: { type: 'string' },
        model: undefined as any
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty('non empty')).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '3.1: parser.isEmpty()',
    description: 'with an empty string',
    given: {
      parser: new StringParser({
        schema: { type: 'string' },
        model: undefined as any
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty('')).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '3.2: parser.isEmpty()',
    description: 'with a non string',
    given: {
      parser: new StringParser({
        schema: { type: 'string' },
        model: 12 as any
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty([ 12 ])).toBeTruthy()
      }
    }
  });

  TestParser.Case({
    case: '3.3: parser.isEmpty()',
    description: 'with default value',
    given: {
      parser: new StringParser({
        schema: { type: 'string' },
        model: 'hello' as any
      })
    },
    expected: {
      parser: {
        isEmpty: ({ parser }: Scope) => expect(parser.isEmpty()).toBeFalsy()
      }
    }
  });

  TestParser.Case({
    case: '4.0',
    description: 'parser.reset()',
    given: {
      parser: new StringParser({
        schema: {
          type: 'string',
          pattern: 'arya|jon',
          minLength: 5,
          maxLength: 15
        },
        model: 'arya',
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        reset({ parser }: Scope) {
          expect(parser.rawValue).toBe('arya');
          expect(parser.model).toBe('arya');

          parser.field.setValue('jon');

          expect(parser.rawValue).toBe('jon');
          expect(parser.model).toBe('jon');

          parser.reset(); // reset without calling onChange

          expect(parser.rawValue).toBe('arya');
          expect(parser.model).toBe('arya');

          parser.field.reset(); // reset with calling onChange

          const { onChange } = parser.options;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ 'arya', 'jon', 'arya' ]);
        }
      }
    }
  });

  TestParser.Case({
    case: '5.0',
    description: 'parser.clear()',
    given: {
      parser: new StringParser({
        schema: {
          type: 'string',
          pattern: 'arya|jon',
          minLength: 5,
          maxLength: 15
        },
        model: 'arya',
        onChange: jest.fn()
      })
    },
    expected: {
      parser: {
        clear({ parser }: Scope) {
          expect(parser.rawValue).toBe('arya');
          expect(parser.model).toBe('arya');

          parser.field.setValue('jon');

          expect(parser.rawValue).toBe('jon');
          expect(parser.model).toBe('jon');

          parser.clear(); // clear without calling onChange

          expect(parser.rawValue).toBeUndefined();
          expect(parser.model).toBeUndefined();

          parser.field.clear(); // clear with calling onChange

          const { onChange } = parser.options;
          const result = onChange.mock.calls.map(([ value ]: any) => value);

          expect(result).toEqual([ 'arya', 'jon', undefined ]);
        }
      }
    }
  });
});
