'use strict'

import { mount } from '@vue/test-utils'
import { Components } from '@/lib/components'

import {
  loadDefaultScalarValue,
  default as component
} from '@/components/FormSchema.js'

/* global describe it expect */

const components = new Components()

const props = {
  schema: {},
  value: undefined,
  action: undefined,
  autocomplete: undefined,
  enctype: 'application/x-www-form-urlencoded',
  method: 'post',
  novalidate: false
}

const schema = {
  type: 'object',
  title: 'Subscription',
  description: 'Subscription Form',
  properties: {
    name: {
      type: 'string',
      title: 'Your name',
      attrs: {
        id: 'x'
      }
    }
  },
  required: ['name']
}

describe('FormSchema', () => {
  describe('default value', () => {
    it('should render default value with an empty schema', () => {
      const schema = {}
      const wrapper = mount(component, {
        propsData: { schema }
      })

      expect(wrapper.emitted().input).toEqual(undefined)
    })

    describe('should render default value with scalar type', () => {
      const proto = [
        {
          type: 'boolean',
          values: [ false, true ]
        },
        {
          type: 'integer',
          values: [ undefined, 0, 1, -1 ]
        },
        {
          type: 'number',
          values: [ undefined, 0.0, 1.0, -1.0, 2.1, -2.1 ]
        },
        {
          type: 'string',
          values: [ undefined, '', ' ', 'hello world' ]
        }
      ]

      proto.forEach(({ type, values }) => {
        describe(`with ${type}`, () => {
          values.forEach((value, i) => {
            it(`should parse ${JSON.stringify(value)} with default value === ${JSON.stringify(value)}`, () => {
              const schema = {
                type: type,
                default: value
              }

              if (value === undefined) {
                delete schema.default
              }

              const wrapper = mount(component, {
                propsData: { schema }
              })

              expect(wrapper.emitted().input[0]).toEqual([value])
            })

            it(`should parse ${JSON.stringify(value)} with initial value === ${JSON.stringify(value)}`, () => {
              const schema = {
                type: type
              }

              const wrapper = mount(component, {
                propsData: { schema, value }
              })

              expect(wrapper.emitted().input[0]).toEqual([value])
            })

            if (i % 2) {
              const initial = values[i - 1]

              it(`should parse ${JSON.stringify(value)} with default === ${JSON.stringify(initial)} and initial === ${JSON.stringify(value)}`, () => {
                const schema = {
                  type: type,
                  default: initial
                }

                const wrapper = mount(component, {
                  propsData: { schema, value }
                })

                expect(wrapper.emitted().input[0]).toEqual([value])
              })

              it(`should parse ${JSON.stringify(value)} with default === ${JSON.stringify(initial)} and attrs.value === ${JSON.stringify(value)}`, () => {
                const schema = {
                  type: type,
                  default: initial,
                  attrs: { value }
                }

                if (type === 'boolean') {
                  schema.attrs.checked = value === true

                  delete schema.attrs.value
                }

                const wrapper = mount(component, {
                  propsData: { schema }
                })

                expect(wrapper.emitted().input[0]).toEqual([value])
              })

              it(`should parse ${JSON.stringify(value)} with initial === ${JSON.stringify(initial)} and attrs.value === ${JSON.stringify(value)}`, () => {
                const schema = {
                  type: type,
                  attrs: { value }
                }

                const propsData = { schema, value }

                if (type === 'boolean') {
                  propsData.value = value === true
                  schema.attrs.checked = propsData.value

                  delete schema.attrs.value
                }

                const wrapper = mount(component, {
                  propsData: { schema, value }
                })

                expect(wrapper.emitted().input[0]).toEqual([value])
              })
            }
          })
        })
      })
    })
  })

  describe('component', () => {
    it('should not be a functional component', () => {
      expect(component.functional).toBe(undefined)
    })

    it('should have the FormSchema name', () => {
      expect(component.name).toEqual('FormSchema')
    })

    it('should have a reset method', () => {
      expect(typeof component.methods.reset).toBe('function')
    })

    it('should have a submit method', () => {
      expect(typeof component.methods.submit).toBe('function')
    })

    it('should have a setErrorMessage method', () => {
      expect(typeof component.methods.setErrorMessage).toBe('function')
    })

    it('should have a clearErrorMessage method', () => {
      expect(typeof component.methods.clearErrorMessage).toBe('function')
    })

    const wrapper = mount(component, {
      propsData: { schema: {} }
    })

    Object.keys(props).forEach((prop) => {
      it(`should have prop ${prop} with default value`, () => {
        expect(prop in wrapper.vm).toBeTruthy()
        expect(wrapper.vm[prop]).toEqual(props[prop])
      })
    })

    it(`should have data ref`, () => {
      expect('ref' in wrapper.vm).toBeTruthy()
      expect(wrapper.vm.ref.startsWith('form-schema-')).toBeTruthy()
    })

    it('should successfully render the component with an empty schema', () => {
      expect(wrapper.html()).toEqual(undefined)
    })

    describe('should successfully render the component', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      it('should have form title', () => {
        expect(wrapper.findAll('h1').length).toEqual(1)
        expect(wrapper.find('h1').html()).toEqual(`<h1>${schema.title}</h1>`)
      })

      it('should have form description', () => {
        expect(wrapper.findAll('p').length).toEqual(1)
        expect(wrapper.find('p').html()).toEqual(`<p>${schema.description}</p>`)
      })

      it('should have form tag', () => {
        expect(wrapper.findAll('form').length).toEqual(1)
      })

      it('should have form enctype attribute', () => {
        expect(wrapper.find('form').element.hasAttribute('enctype')).toBeTruthy()
        expect(wrapper.find('form').element.getAttribute('enctype')).toEqual(props.enctype)
      })

      it('should have form method attribute', () => {
        expect(wrapper.find('form').element.hasAttribute('method')).toBeTruthy()
        expect(wrapper.find('form').element.getAttribute('method')).toEqual(props.method)
      })

      it('should have input label', () => {
        expect(wrapper.findAll('label').length).toEqual(1)
        expect(wrapper.find('label').html()).toEqual('<label for="x">Your name</label>')
      })

      it('should have form input', () => {
        expect(wrapper.findAll('input').length).toEqual(1)
        expect(wrapper.find('input').html()).toEqual('<input id="x" type="text" name="name" required="required">')
      })

      it('should not have buttons', () => {
        expect(wrapper.findAll('button').length).toEqual(0)
      })

      it('should successfully render buttons via slots', () => {
        const schema = { type: 'string' }
        const wrapper = mount(component, {
          propsData: { schema },
          slots: {
            default: '<button type="submit">Submit</button>'
          }
        })

        expect(wrapper.findAll('button').length).toEqual(1)
        expect(wrapper.find('button').html()).toEqual('<button type="submit">Submit</button>')
      })
    })

    describe('should successfully render the component with reactive schema - load(schema)', () => {
      const wrapper = mount(component, {
        propsData: { schema: {} }
      })

      it('should render nothing with empty schema', () => {
        expect(wrapper.html()).toEqual(undefined)
        wrapper.vm.load(schema)
      })

      it('should have form title', () => {
        expect(wrapper.findAll('h1').length).toEqual(1)
        expect(wrapper.find('h1').html()).toEqual(`<h1>${schema.title}</h1>`)
      })

      it('should have form title', () => {
        expect(wrapper.findAll('h1').length).toEqual(1)
        expect(wrapper.find('h1').html()).toEqual(`<h1>${schema.title}</h1>`)
      })

      it('should have form description', () => {
        expect(wrapper.findAll('p').length).toEqual(1)
        expect(wrapper.find('p').html()).toEqual(`<p>${schema.description}</p>`)
      })

      it('should have form tag', () => {
        expect(wrapper.findAll('form').length).toEqual(1)
      })

      it('should have form enctype attribute', () => {
        expect(wrapper.find('form').element.hasAttribute('enctype')).toBeTruthy()
        expect(wrapper.find('form').element.getAttribute('enctype')).toEqual(props.enctype)
      })

      it('should have form method attribute', () => {
        expect(wrapper.find('form').element.hasAttribute('method')).toBeTruthy()
        expect(wrapper.find('form').element.getAttribute('method')).toEqual(props.method)
      })

      it('should have input label', () => {
        expect(wrapper.findAll('label').length).toEqual(1)
        expect(wrapper.find('label').html()).toEqual('<label for="x">Your name</label>')
      })

      it('should have form input', () => {
        expect(wrapper.findAll('input').length).toEqual(1)
        expect(wrapper.find('input').html()).toEqual('<input id="x" type="text" name="name" required="required">')
      })

      it('should not have buttons', () => {
        expect(wrapper.findAll('button').length).toEqual(0)
      })
    })

    describe('should successfully render the component with reactive schema - load(schema, model)', () => {
      const model = {
        name: 'Lanister'
      }
      const wrapper = mount(component, {
        propsData: { schema: {} }
      })

      it('should render nothing with empty schema', () => {
        expect(wrapper.html()).toEqual(undefined)
        expect(wrapper.emitted().input).toEqual(undefined)

        wrapper.vm.load(schema, model)
      })

      it('should have form input', () => {
        expect(wrapper.emitted().input.pop()).toEqual([{ name: 'Lanister' }])
        expect(wrapper.findAll('input').length).toEqual(1)
        expect(wrapper.find('input').html()).toEqual('<input id="x" type="text" name="name" value="Lanister" required="required">')
      })
    })

    it('should successfully emit events', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      const input = wrapper.find('input')
      const expected = {
        name: 'Sébastien'
      }

      expect(wrapper.vm.data).toEqual({ name: '' })

      input.element.value = expected.name
      input.trigger('input')

      expect('input' in wrapper.emitted()).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toEqual(expected)

      expect(wrapper.vm.data).toEqual(expected)
    })

    it('vm.form()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      expect(wrapper.vm.form().tagName).toEqual('FORM')
    })

    it('vm.reportValidity()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      const input = wrapper.find('input')

      input.element.value = 'Sébastien'

      expect(wrapper.vm.reportValidity()).toBeTruthy()
      expect(wrapper.vm.checkValidity()).toBeTruthy()
    })

    it('vm.reset()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      const input = wrapper.find('input')
      const expected = {
        name: 'Sébastien'
      }

      input.element.value = expected.name
      input.trigger('input')

      expect(wrapper.vm.data).toEqual(expected)

      wrapper.vm.reset()

      expect(wrapper.vm.data).toEqual({ name: '' })
    })

    it('vm.setErrorMessage(message)', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      wrapper.vm.setErrorMessage('error message')

      expect(wrapper.vm.error).toEqual('error message')
      expect(wrapper.findAll('[data-fs-error]').length).toEqual(1)
      expect(wrapper.find('[data-fs-error]').html()).toEqual('<div data-fs-error="true">error message</div>')
    })

    it('vm.clearErrorMessage()', () => {
      const wrapper = mount(component, {
        propsData: { schema }
      })

      wrapper.vm.setErrorMessage('error message')

      expect(wrapper.vm.error).toEqual('error message')

      wrapper.vm.clearErrorMessage()

      expect(wrapper.vm.error).toEqual(null)
      expect(wrapper.findAll('[data-fs-error]').length).toEqual(0)
    })
  })

  describe('redering', () => {
    describe('select element', () => {
      it('should render with type === string and the enum field with stringify values', () => {
        const schema = {
          type: 'object',
          properties: {
            list: {
              type: 'string',
              title: 'choices',
              description: 'choices description',
              enum: ['v0', 'v1'],
              attrs: {
                id: 'x'
              }
            }
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<form enctype="application/x-www-form-urlencoded" method="post"><div data-fs-field="x"><label for="x">choices</label><div data-fs-field-input="x"><select id="x" name="list"><option value="v0">v0</option><option value="v1">v1</option></select><small>choices description</small></div></div></form>'

        expect(wrapper.find('form').html()).toEqual(expected)
      })
    })

    describe('checkbox element', () => {
      it('should render with truely default value', () => {
        const schema = {
          type: 'boolean',
          default: true,
          attrs: {
            id: 'x',
            name: 'checkbox-name'
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<input id="x" name="checkbox-name" type="checkbox" checked="checked">'

        expect(wrapper.find('input').html()).toEqual(expected)
      })

      it('should render with falsely default value', () => {
        const schema = {
          type: 'boolean',
          default: false,
          attrs: {
            id: 'x',
            name: 'checkbox-name'
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<input id="x" name="checkbox-name" type="checkbox">'

        expect(wrapper.find('input').html()).toEqual(expected)
      })
    })

    describe('multiple custom form elements', () => {
      const schema = {
        type: 'boolean',
        default: true,
        attrs: {
          id: 'x',
          name: 'checkbox-name'
        }
      }

      it('should render with custom checkbox component', () => {
        const components = new Components()

        components.set('checkbox', {
          functional: true,
          render (h, { props, listeners }) {
            return h('span', {
              attrs: props,
              on: listeners
            })
          }
        })

        const wrapper = mount(component, {
          propsData: { schema, components }
        })

        const expected = '<form enctype="application/x-www-form-urlencoded" method="post"><span id="x" name="checkbox-name" type="checkbox" checked="checked"></span></form>'

        expect(wrapper.find('form').html()).toEqual(expected)
      })

      it('should render with overwrite custom checkbox component', () => {
        const components = new Components()

        components.set('checkbox', {
          functional: true,
          render (h) {
            return h('div', {
              attrs: { type: 'checkbox' }
            })
          }
        })

        const wrapper = mount(component, {
          propsData: { schema, components }
        })

        const expected = '<form enctype="application/x-www-form-urlencoded" method="post"><div type="checkbox"></div></form>'

        expect(wrapper.find('form').html()).toEqual(expected)
      })

      it('should render with default components', () => {
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<form enctype="application/x-www-form-urlencoded" method="post"><input id="x" name="checkbox-name" type="checkbox" checked="checked"></form>'

        expect(wrapper.find('form').html()).toEqual(expected)
      })
    })

    describe('array fields', () => {
      it('should successfully render with attrs.type', () => {
        const schema = {
          type: 'object',
          properties: {
            images: {
              type: 'array',
              minItems: 2,
              attrs: {
                id: 'x',
                type: 'file'
              }
            }
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<form enctype="application/x-www-form-urlencoded" method="post"><div data-fs-array-inputs="true"><input id="x" type="file" name="images-0" data-fs-index="0"><input id="x-1" type="file" name="images-1" data-fs-index="1"></div><button type="button">Add</button></form>'

        expect(wrapper.find('form').html()).toEqual(expected)
      })
    })

    describe('array number fields', () => {
      it('should successfully render with attrs.type number', () => {
        const schema = {
          type: 'object',
          properties: {
            images: {
              type: 'array',
              items: {
                type: 'number'
              },
              attrs: {
                id: 'x'
              }
            }
          }
        }
        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expected = '<form enctype="application/x-www-form-urlencoded" method="post"><div data-fs-array-inputs="true"><input id="x" name="images-0" type="number" data-fs-index="0"></div><button type="button">Add</button></form>'

        expect(wrapper.find('form').html()).toEqual(expected)
      })
    })
  })

  describe('should successfully emit input and change events', () => {
    const expectedEvents = ['input', 'change']
    const properties = {
      x: {
        type: 'string'
      }
    }

    const casesInitialModel = [
      { type: 'string', value: 'hello world', initial: undefined },
      { type: 'string', value: 'hello world', initial: 'seb' },
      { type: 'integer', value: -12, initial: undefined },
      { type: 'integer', value: 12, initial: -25 },
      { type: 'number', value: -2.5, initial: undefined },
      { type: 'number', value: 2.5, initial: -0.5 },
      { type: 'object',
        value: 'hello',
        initial: undefined,
        initialExpect: { x: '' },
        expected: { x: 'hello' } },
      { type: 'object',
        value: 'hello',
        initial: { x: 'seb' },
        initialExpect: { x: 'seb' },
        expected: { x: 'hello' } }
    ]

    casesInitialModel.forEach(({ type, value, initial, initialExpect = initial, expected = value }) => {
      describe(`with type === ${type}`, () => {
        describe('with initial model value', () => {
          const schema = { type, properties }
          const wrapper = mount(component, {
            propsData: { schema, value: initial }
          })

          it('should emit the initial value', () => {
            expect(Object.keys(wrapper.emitted())).toEqual(['input'])
            expect(wrapper.emitted().input.pop()).toEqual([initialExpect])
          })

          it('should emit input and change events with new value', () => {
            const input = wrapper.find('input')

            input.element.value = value

            input.trigger('input')
            input.trigger('change')

            expect(Object.keys(wrapper.emitted())).toEqual(expectedEvents)
            expect(wrapper.emitted().input.pop()).toEqual([expected])
            expect(wrapper.emitted().change.pop()).toEqual([expected])
          })
        })

        if (typeof initial !== 'object') {
          describe('with initial default schema value', () => {
            const schema = {
              type: type,
              default: initial,
              properties: properties
            }

            const wrapper = mount(component, {
              propsData: { schema }
            })

            it('should emit the initial value', () => {
              expect(Object.keys(wrapper.emitted())).toEqual(['input'])
              expect(wrapper.emitted().input.pop()).toEqual([initialExpect])
            })

            it('should emit input and change events with new value', () => {
              const input = wrapper.find('input')

              input.element.value = value

              input.trigger('input')
              input.trigger('change')

              expect(Object.keys(wrapper.emitted())).toEqual(expectedEvents)
              expect(wrapper.emitted().input.pop()).toEqual([expected])
              expect(wrapper.emitted().change.pop()).toEqual([expected])
            })
          })
        }
      })
    })

    describe('with type === boolean', () => {
      it('with initial empty value', () => {
        const schema = {
          type: 'boolean'
        }

        const wrapper = mount(component, {
          propsData: { schema }
        })

        const expectedValue = false
        const expectedEvents = ['click', 'change', 'input']

        wrapper.find('input').setChecked(true)

        const attrs = wrapper.find('input').attributes()
        const expected = { type: 'checkbox', checked: 'checked' }

        expect(typeof attrs.id).toEqual('string')

        delete attrs.id

        expect(attrs).toEqual(expected)
      })
    })
  })
})
