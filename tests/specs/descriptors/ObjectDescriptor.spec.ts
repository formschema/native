import { ObjectParser } from '@/parsers/ObjectParser';
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
            lastname: { type: 'string' },
            city: { type: 'string' },
            firstname: { type: 'string' }
          },
          required: [ 'firstname' ]
        },
        model: { firstname: 'Jon', lastname: 'Snow', city: '' },
        name: 'profile',
        descriptor: {
          order: [ 'firstname' ]
        }
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
          value: ({ value }: Scope) => expect(value).toEqual({ firstname: 'Jon', lastname: 'Snow', city: '' }),
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
          descriptor: {
            orderedProperties: [ 'firstname', 'lastname', 'city' ],
            childrenGroups: [
              {
                children({ value }: Scope) {
                  const expectedFieldOrders = [ 'firstname', 'lastname', 'city' ];

                  value.forEach((item: any, index: number) => expect(item.property).toBe(expectedFieldOrders[index]));
                }
              }
            ]
          }
        }
      }
    }
  });
});
