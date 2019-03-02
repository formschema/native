'use strict'

import { mount } from '@vue/test-utils'
import { loadFields } from '@/lib/parser'
import { Components } from '@/lib/components'

import component from '@/components/FormSchemaField.js'
import sinon from 'sinon'

/* global describe it expect */

const components = new Components()

describe('FormSchemaField', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const field = {
      label: 'Name',
      attrs: {
        name: 'fieldName',
        type: 'text',
        value: 'Hello'
      }
    }
    const value = {
      [field.attrs.name]: field.attrs.value
    }
    const wrapper = mount(component, {
      context: {
        field,
        components,
        props: { value }
      }
    })

    const input = wrapper.find('input')
    const expected = '<div><label>Name</label><div><input name="fieldName" type="text" value="Hello"></div></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component without the label element', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'text',
        value: 'Hello'
      }
    }
    const value = {
      [field.attrs.name]: field.attrs.value
    }
    const wrapper = mount(component, {
      context: {
        field,
        components,
        props: { value }
      }
    })

    const input = wrapper.find('input')
    const expected = '<input name="fieldName" type="text" value="Hello">'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with missing field.attrs.value', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'text'
      }
    }
    const value = 'Hello'
    const wrapper = mount(component, {
      context: {
        field,
        components,
        props: { value }
      }
    })

    const input = wrapper.find('input')
    const expected = '<input name="fieldName" type="text">'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with field.attrs.type === textarea', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'textarea'
      }
    }
    const value = 'Hello'
    const wrapper = mount(component, {
      context: {
        field,
        components,
        props: { value }
      }
    })

    expect(wrapper.findAll('textarea').length).toEqual(1)
    expect(wrapper.findAll('label').length).toEqual(0)

    const textarea = wrapper.find('textarea')

    expect(textarea.html()).toEqual('<textarea name="fieldName">Hello</textarea>')

    textarea.element.innerHTML = 'Sébastien'

    expect(textarea.html()).toEqual('<textarea name="fieldName">Sébastien</textarea>')
  })

  describe('component with field.attrs.type === redio', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'radio',
        value: 'Hello'
      }
    }

    it('should successfully render the component', () => {
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: {}
        }
      })

      expect(wrapper.findAll('input').length).toEqual(1)
      expect(wrapper.findAll('label').length).toEqual(0)

      const input = wrapper.find('input')
      const expected = '<input name="fieldName" type="radio" value="Hello">'

      expect(input.html()).toEqual(expected)
    })

    it('should successfully emit event', () => {
      const spyInput = sinon.spy()
      const spyChange = sinon.spy()
      const listeners = {
        input: spyInput,
        change: spyChange
      }
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: {},
          on: listeners
        }
      })

      const input = wrapper.find('input')

      input.element.value = 'Sébastien'
      input.trigger('input')

      expect(spyInput.calledOnce).toBeTruthy()
      expect(spyChange.called).toBe(false)

      expect(input.html()).toEqual('<input name="fieldName" type="radio" value="Sébastien">')
    })
  })

  describe('component with field.attrs.type === radio and items', () => {
    const field = {
      isArrayField: true,
      attrs: {
        id: 'x',
        name: 'fieldName',
        type: 'radio'
      },
      items: [
        { id: 'y', label: 'l1', value: '0' },
        { id: 'z', label: 'l2', value: '1' }
      ]
    }
    const value = ['1']

    it('should successfully render the component', () => {
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value }
        }
      })

      const expected = '<fieldset name="fieldName"><div data-fs-field="y"><label for="y">l1</label><div data-fs-field-input="y"><input id="y" name="fieldName" type="radio" value="0"></div></div><div data-fs-field="z"><label for="z">l2</label><div data-fs-field-input="z"><input id="z" name="fieldName" type="radio" value="1" checked="checked"></div></div></fieldset>'

      expect(wrapper.html()).toEqual(expected)
    })

    it('should successfully emit event', () => {
      const spyInput = sinon.spy()
      const spyChange = sinon.spy()
      const listeners = {
        input: spyInput,
        change: spyChange
      }
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value },
          on: listeners
        }
      })

      const input = wrapper.find('input')
      const expectedData = {
        fieldName: input.element.value
      }

      input.trigger('click')

      expect(spyInput.calledOnce).toBeTruthy()
      expect(spyChange.called).toBeTruthy()
    })
  })

  describe('component with field.attrs.type === checkbox', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'checkbox',
        value: 'Hello'
      }
    }
    const value = field.attrs.value

    it('should successfully render the component', () => {
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value }
        }
      })

      const expected = '<input name="fieldName" type="checkbox" value="Hello">'

      expect(wrapper.html()).toEqual(expected)
    })

    it('should successfully emit event', () => {
      const spyInput = sinon.spy()
      const spyChange = sinon.spy()
      const listeners = {
        input: spyInput,
        change: spyChange
      }
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value },
          on: listeners
        }
      })

      const input = wrapper.find('input')
      const expectedData = {
        fieldName: input.element.value
      }

      input.trigger('click')

      expect(input.element.checked).toBe(true)
      expect(spyInput.firstCall).toBeTruthy()
      expect(spyChange.firstCall).toBeTruthy()

      input.trigger('click')

      expect(input.element.checked).toBe(false)
      expect(spyInput.secondCall).toBeTruthy()
      expect(spyChange.secondCall).toBeTruthy()
    })
  })

  describe('component with field.attrs.type === checkbox and items', () => {
    const fields = []
    const schema = {
      type: 'array',
      title: 'choices',
      description: 'choices description',
      anyOf: [
        { id: 'y', name: 'fieldName', label: 'l1', value: 'v0' },
        { id: 'z', name: 'fieldName', label: 'l2', value: 'v1', checked: true }
      ],
      attrs: {
        id: 'x',
        name: 'fieldName',
        type: 'checkbox'
      }
    }

    loadFields(schema, fields)

    const value = ['v1']
    const field = fields[0]

    it('should successfully render the component', () => {
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value }
        }
      })

      const expected = '<div data-fs-field="x"><label id="x-label" for="x">choices</label><div data-fs-field-input="x"><fieldset name="fieldName"><legend>choices description</legend><div data-fs-field="y"><label for="y">l1</label><div data-fs-field-input="y"><input id="y" name="fieldName" type="checkbox" value="v0"></div></div><div data-fs-field="z"><label for="z">l2</label><div data-fs-field-input="z"><input id="z" name="fieldName" type="checkbox" value="v1" checked="checked"></div></div></fieldset></div></div>'

      expect(wrapper.html()).toEqual(expected)
    })

    it('should successfully emit event', () => {
      const spyInput = sinon.spy()
      const spyChange = sinon.spy()
      const listeners = {
        input: spyInput,
        change: spyChange
      }
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value },
          on: listeners
        }
      })

      const input = wrapper.find('input')
      const input1 = wrapper.findAll('input').at(1)

      input.trigger('click')

      expect(input.element.checked).toBe(true)
      expect(spyInput.firstCall).toBeTruthy()
      expect(spyChange.firstCall).toBeTruthy()

      input1.trigger('click')

      expect(input1.element.checked).toBe(false)
      expect(spyInput.secondCall).toBeTruthy()
      expect(spyChange.secondCall).toBeTruthy()
    })
  })

  describe('component with field.attrs.type === string and the enum field', () => {
    it('should render the select element', () => {
      const fields = []
      const schema = {
        type: 'string',
        title: 'choices',
        description: 'choices description',
        enum: [
          { label: 'l1', value: 'v0' },
          { label: 'l2', value: 'v1' }
        ],
        attrs: {
          id: 'x'
        }
      }

      loadFields(schema, fields)

      const field = fields[0]
      const value = ''
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value }
        }
      })

      const expected = '<div data-fs-field="x"><label id="x-label" for="x">choices</label><div data-fs-field-input="x"><select id="x" aria-labelledby="x-label x-desc"><option value="v0">l1</option><option value="v1">l2</option></select><small id="x-desc">choices description</small></div></div>'

      expect(wrapper.html()).toEqual(expected)
    })

    it('should render the select element with stringify values', () => {
      const fields = []
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

      loadFields(schema, fields)

      const field = fields[0]
      const value = ''
      const wrapper = mount(component, {
        context: {
          field,
          components,
          props: { value }
        }
      })

      const expected = '<div data-fs-field="x"><label id="x-label" for="x">choices</label><div data-fs-field-input="x"><select id="x" name="list" aria-labelledby="x-label x-desc"><option value="v0">v0</option><option value="v1">v1</option></select><small id="x-desc">choices description</small></div></div>'

      expect(wrapper.html()).toEqual(expected)
    })
  })

  it('should render the select element with type === string and the enum field with default value', () => {
    const fields = []
    const schema = {
      type: 'string',
      title: 'choices',
      description: 'choices description',
      enum: [
        { id: 'y', label: 'l1', value: 'v0' },
        { id: 'z', label: 'l2', value: 'v1' }
      ],
      attrs: {
        id: 'x'
      }
    }

    loadFields(schema, fields)

    const field = fields[0]
    const value = 'v1'
    const wrapper = mount(component, {
      context: {
        field,
        components,
        props: { value }
      }
    })

    const expected = '<div data-fs-field="x"><label id="x-label" for="x">choices</label><div data-fs-field-input="x"><select id="x" aria-labelledby="x-label x-desc"><option value="v0">l1</option><option value="v1" selected="selected">l2</option></select><small id="x-desc">choices description</small></div></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should render the select element with type === array and the enum field', () => {
    const fields = []
    const schema = {
      type: 'array',
      title: 'choices',
      description: 'choices description',
      enum: [
        { id: 'y', label: 'l1', value: 'v0' },
        { id: 'z', label: 'l2', value: 'v1', selected: true }
      ],
      attrs: {
        id: 'x',
        name: 'fieldName'
      }
    }

    loadFields(schema, fields)

    const field = fields[0]
    const value = ['v1']
    const wrapper = mount(component, {
      context: {
        field,
        components,
        props: { value }
      }
    })

    const expected = '<div data-fs-field="x"><label id="x-label" for="x">choices</label><div data-fs-field-input="x"><select multiple="multiple" id="x" name="fieldName" aria-labelledby="x-label x-desc"><option value="v0">l1</option><option value="v1" selected="selected">l2</option></select><small id="x-desc">choices description</small></div></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should render the select element with type === array and the enum field with required field', () => {
    const fields = []
    const schema = {
      type: 'object',
      properties: {
        fieldName: {
          type: 'array',
          title: 'choices',
          description: 'choices description',
          enum: [
            { id: 'y', label: 'l1', value: 'v0' },
            { id: 'z', label: 'l2', value: 'v1', selected: true }
          ],
          attrs: {
            id: 'x'
          }
        }
      },
      required: ['fieldName']
    }

    loadFields(schema, fields)

    const field = fields[0]
    const value = ['v0']
    const wrapper = mount(component, {
      context: {
        field,
        components,
        props: { value }
      }
    })

    const expected = '<div data-fs-field="x" data-fs-required="true"><label id="x-label" for="x">choices</label><div data-fs-field-input="x"><select multiple="multiple" id="x" name="fieldName" required="required" aria-required="true" aria-labelledby="x-label x-desc"><option value=""></option><option value="v0" selected="selected">l1</option><option value="v1">l2</option></select><small id="x-desc">choices description</small></div></div>'

    expect(wrapper.html()).toEqual(expected)
  })
/*
//*/
//   it('should successfully emit input event', () => {
//     const field = {
//       attrs: {
//         type: 'text',
//         name: 'fieldName',
//         value: 'Hello'
//       },
//       itemsNum: 2
//     }
//     const vm = {
//       inputValues: {
//         'fieldName': 'Hello'
//       },
//       data: {
//         fieldName: 'Hello'
//       },
//       changed (e) {
//         wrapper.vm.$emit('change', e)
//       }
//     }
//     const wrapper = mount(component, {
//       context: {
//         props: { field, vm }
//       }
//     })
//
//     vm.$emit = wrapper.vm.$emit
//
//     const expected = {
//       fieldName: 'Sébastien'
//     }
//     const input = wrapper.find('input')
//
//     input.element.value = 'Sébastien'
//     input.trigger('input')
//
//     expect(wrapper.emitted().input[0][0]).toEqual(expected)
//     expect(vm.data).toEqual(expected)
//   })
//
//   it('should successfully emit input event with an empty value', () => {
//     const field = {
//       attrs: {
//         type: 'text',
//         name: 'fieldName',
//         value: 'Hello'
//       }
//     }
//     const value = field.attrs.value
//     const wrapper = mount(component, {
//       context: {
//         props: { field, value }
//       }
//     })
//
//     const expected = {
//       fieldName: ''
//     }
//     const input = wrapper.find('input')
//
//     input.element.value = ''
//     input.trigger('input')
//
//     expect(wrapper.emitted().input[0][0]).toEqual(expected)
//     expect(vm.data).toEqual(expected)
//   })
})
