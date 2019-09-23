import { Options } from '../../lib/Options';
import { TestParser, Scope } from '../../lib/TestParser';

describe('parsers/ScalarParser', () => {
  TestParser.Case({
    case: '1.0: ScalarParser.getKind()',
    description: 'should return kind `radio` with schema.enum',
    given: Options.get({
      schema: {
        type: 'string',
        enum: [ 'arya' ]
      },
      model: undefined as any
    }),
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('enum'),
        field: {
          kind: ({ value }: Scope) => expect(value).toBe('enum'),
          children: [
            {
              kind: ({ value }: Scope) => expect(value).toBe('radio')
            }
          ]
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
    case: '1.2: ScalarParser.getKind()',
    description: 'should return kind `hidden` with schema.const',
    given: Options.get({
      schema: { type: 'string', const: 'hello' },
      model: undefined as any
    }),
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('hidden'),
        field: {
          kind: ({ value }: Scope) => expect(value).toBe('hidden'),
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('hidden')
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
    case: '1.3: ScalarParser.getKind()',
    description: 'should return kind `null` for unknow kind',
    given: Options.get({
      schema: { type: 'string' },
      model: undefined as any
    }),
    expected: {
      parser: {
        kind: ({ value }: Scope) => expect(value).toBe('string'),
        field: {
          kind: ({ value }: Scope) => expect(value).toBe('string')
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
    case: '2.0: ScalarParser.getType()',
    description: 'should return type `radio` with schema.enum',
    given: Options.get({
      schema: {
        type: 'string',
        enum: [ 'arya' ]
      },
      model: undefined as any
    }),
    expected: {
      parser: {
        field: {
          children: [
            {
              attrs: {
                type: ({ value }: Scope) => expect(value).toBe('radio')
              }
            }
          ]
        }
      }
    }
  });

  TestParser.Case({
    case: '2.1: ScalarParser.getType()',
    description: 'should return type `null` with schema.enum',
    given: Options.get({
      schema: { type: 'string' },
      model: undefined as any
    }),
    expected: {
      parser: {
        field: {
          attrs: {
            type: ({ value }: Scope) => expect(value).toBe('text')
          }
        }
      }
    }
  });
});
