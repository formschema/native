import { Parser } from '@/parsers/Parser';
import { NativeElements } from '@/lib/NativeElements';
import { InputElement } from '@/components/InputElement';
import { TestParser, Scope } from '../../lib/TestParser';

describe('descriptors/ScalarUIDescriptor', () => {
  TestParser.Case({
    case: '1.0',
    description: 'generic scalar field',
    given: {
      parser: Parser.get({
        schema: {
          type: 'string'
        },
        model: 'Jon Snow',
        name: 'name',
        required: true,
        descriptor: {
          label: 'Name',
          helper: 'Your Name',
          props: {},
          attrs: {
            id: 'name'
          }
        }
      })
    },
    expected: {
      parser: {
        field: {
          kind: ({ value }: Scope) => expect(value).toBe('string'),
          value: ({ value, parser: { options } }: Scope) => expect(value).toEqual(options.model),
          attrs: {
            id: ({ value, options }: Scope) => expect(value.startsWith(`${options.name}-`)).toBeTruthy(),
            type: ({ value }: Scope) => expect(value).toBe('text'),
            name: ({ value, options }: Scope) => expect(value).toBe(options.name),
            required: ({ value, options }: Scope) => expect(value).toBe(options.required)
          },
          descriptor: {
            kind: ({ value, parser }: Scope) => expect(value).toBe(parser.field.kind),
            label: ({ value, options }: Scope) => expect(value).toBe(options.descriptor.label),
            helper: ({ value, options }: Scope) => expect(value).toBe(options.descriptor.helper),
            components: ({ value }: Scope) => expect(value).toBe(NativeElements),
            component: ({ value }: Scope) => expect(value).toBe(InputElement),
            props: ({ value, options }: Scope) => expect(value).toEqual(options.descriptor.props),
            attrs({ value, field, options, descriptor }: any) {
              expect(value).not.toEqual(field.attrs);
              expect(value.id).toBe(options.descriptor.attrs.id);
              expect(value['aria-labelledby']).toBe(descriptor.labelAttrs.id);
              expect(value['aria-describedby']).toBe(descriptor.helperAttrs.id);
            },
            labelAttrs: {
              id: ({ value }: Scope) => expect(value).toBeDefined(),
              for: ({ value }: Scope) => expect(value).toBeDefined()
            },
            helperAttrs: {
              id: ({ value }: Scope) => expect(value).toBeDefined()
            }
          }
        }
      }
    }
  });

  TestParser.Case({
    case: '2.0',
    description: 'hidden field',
    given: {
      parser: Parser.get({
        schema: {
          type: 'string'
        },
        model: 'Jon Snow',
        name: 'name',
        required: true,
        descriptor: {
          kind: 'hidden',
          label: 'Name',
          helper: 'Your Name',
          props: {},
          attrs: {
            id: 'name'
          }
        }
      })
    },
    expected: {
      parser: {
        field: {
          attrs: {
            id: ({ value, options }: Scope) => expect(value.startsWith(`${options.name}-`)).toBeTruthy(),
            type: ({ value }: Scope) => expect(value).toBe('hidden'),
            name: ({ value, options }: Scope) => expect(value).toBe(options.name),
            required: ({ value, options }: Scope) => expect(value).toBe(options.required)
          },
          descriptor: {
            attrs: {
              id: ({ value, options }: Scope) => expect(value).toBe(options.descriptor.attrs.id),
              'aria-labelledby': ({ value, descriptor }: Scope) => expect(value).toBe(descriptor.labelAttrs.id),
              'aria-describedby': ({ value, descriptor }: Scope) => expect(value).toBe(descriptor.helperAttrs.id)
            },
            kind: ({ value, parser }: Scope) => expect(value).toBe(parser.field.kind),
            label: ({ value, options }: Scope) => expect(value).toBe(options.descriptor.label),
            helper: ({ value, options }: Scope) => expect(value).toBe(options.descriptor.helper),
            component: ({ value }: Scope) => expect(value).toBe('input')
          }
        }
      }
    }
  });
});
