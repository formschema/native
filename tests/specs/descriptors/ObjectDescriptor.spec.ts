import { Parser } from '@/parsers/Parser';
import { ObjectParser } from '@/parsers/ObjectParser';
import { ListField, ObjectField, ObjectFieldChild, ParserOptions } from '@/types';
import { JsonSchema } from '@/types/jsonschema';
import { TestParser, Scope } from '../../lib/TestParser';

describe('descriptors/ObjectDescriptor', () => {
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
          required: ['name']
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
          }
        }
      }
    }
  });
});
