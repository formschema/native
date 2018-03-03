'use strict'

import { mount } from '@vue/test-utils'
import { loadFields } from '@/lib/parser'
import { init, initFields } from '@/lib/components'

import component from '@/components/FormSchemaField.js'

/* global describe it expect */

init()

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
    const vm = {
      data: {
        [field.attrs.name]: field.attrs.value
      },
      inputValues: {
        [field.attrs.name]: field.attrs.value
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    expect(wrapper.isVueInstance()).toBeTruthy()

    const input = wrapper.find('input')
    const expected = '<label><span data-required-field="false">Name</span><input name="fieldName" type="text" value="Hello"></label>'

    expect(wrapper.html()).toEqual(expected)
    expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])
  })

  it('should successfully render the component without the label element', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'text',
        value: 'Hello'
      }
    }
    const vm = {
      data: {
        [field.attrs.name]: field.attrs.value
      },
      inputValues: {
        [field.attrs.name]: field.attrs.value
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    expect(wrapper.isVueInstance()).toBeTruthy()

    const input = wrapper.find('input')
    const expected = '<input name="fieldName" type="text" value="Hello">'

    expect(wrapper.html()).toEqual(expected)
    expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])
  })

  it('should successfully render the component with missing field.attrs.value', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'text'
      }
    }
    const vm = {
      data: {
        [field.attrs.name]: 'Hello'
      },
      inputValues: {
        [field.attrs.name]: 'Hello'
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    expect(wrapper.isVueInstance()).toBeTruthy()

    const input = wrapper.find('input')
    const expected = '<input name="fieldName" type="text" value="Hello">'

    expect(wrapper.html()).toEqual(expected)
    expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])
  })

  it('should successfully render the component with field.attrs.type === textarea', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'textarea'
      }
    }
    const vm = {
      data: {
        [field.attrs.name]: 'Hello'
      },
      inputValues: {
        [field.attrs.name]: 'Hello'
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const form = {
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { field, vm }
          })
        ])
      }
    }
    const wrapper = mount(form)

    expect(wrapper.findAll('textarea').length).toEqual(1)
    expect(wrapper.findAll('label').length).toEqual(0)

    const textarea = wrapper.find('textarea')

    // component
    expect(textarea.is('textarea')).toBe(true)
    expect(textarea.isEmpty()).toBe(true)
    expect(textarea.vnode.data.attrs.name).toEqual(field.attrs.name)
    expect(Object.keys(textarea.vnode.data.on)).toEqual(['input', 'change'])

    // render
    expect(textarea.html()).toEqual('<textarea name="fieldName">Hello</textarea>')

    // event
    textarea.element.innerHTML = 'Sébastien'

    expect(textarea.html()).toEqual('<textarea name="fieldName">Sébastien</textarea>')
  })

  it('should successfully render the component with field.attrs.type === redio', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'radio'
      }
    }
    const vm = {
      data: {
        [field.attrs.name]: 'Hello'
      },
      inputValues: {
        [field.attrs.name]: 'Hello'
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    expect(wrapper.findAll('input').length).toEqual(1)
    expect(wrapper.findAll('label').length).toEqual(0)

    const input = wrapper.find('input')

    // component
    expect(input.is('input')).toBe(true)
    expect(input.isEmpty()).toBe(true)
    expect(input.vnode.data.attrs.name).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.type).toEqual(field.attrs.type)
    expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

    // render
    expect(input.html()).toEqual('<input name="fieldName" type="radio" value="Hello">')

    // event
    input.element.value = 'Sébastien'

    expect(input.html()).toEqual('<input name="fieldName" type="radio" value="Sébastien">')
  })

  it('should successfully render the component with field.attrs.type === radio and items', () => {
    const field = {
      isArrayField: true,
      attrs: {
        name: 'fieldName',
        type: 'radio'
      },
      items: [
        { label: 'l1', value: '0' },
        { label: 'l2', value: '1' }
      ]
    }
    const vm = {
      data: {
        [field.attrs.name]: '1'
      },
      inputValues: {
        [field.attrs.name]: '1'
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = '<div><fieldset name="fieldName"><div><label><span data-required-field="false">l1</span><input name="fieldName" type="radio" value="0"></label><label><span data-required-field="false">l2</span><input name="fieldName" type="radio" value="1" checked="checked"></label></div></fieldset><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)

    // event
    const elements = wrapper.findAll('input')

    field.items.map((item) => item.value).forEach((value, i) => {
      expect(Object.keys(elements.at(i).vnode.data.on)).toEqual(['input', 'change'])
    })

    const input = wrapper.find('input')
    const expectedData = {
      fieldName: input.element.value
    }

    input.trigger('click')

    expect(Object.keys(wrapper.emitted())).toEqual(['input', 'change'])
    expect(vm.data).toEqual(expectedData)
  })

  it('should successfully render the component with field.attrs.type === checkbox', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'checkbox',
        value: 'Hello'
      }
    }
    const vm = {
      data: {},
      inputValues: {},
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }

    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = '<input name="fieldName" type="checkbox" value="Hello">'

    expect(wrapper.html()).toEqual(expected)

    const input = wrapper.find('input')

    // component
    expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

    // event
    const expectedData = {
      fieldName: input.element.value
    }

    input.element.dispatchEvent(new Event('click'))

    expect(input.element.checked).toBe(true)
    expect(Object.keys(wrapper.emitted())).toEqual(['input', 'change'])
    expect(vm.data).toEqual(expectedData)

    input.element.dispatchEvent(new Event('click'))
    expect(input.element.checked).toBe(false)
  })

  it('should successfully render the component with field.attrs.type === checkbox and items', () => {
    const fields = []
    const schema = {
      type: 'array',
      title: 'choices',
      description: 'choices description',
      anyOf: [
        { name: 'fieldName', label: 'l1', value: 'v0' },
        { name: 'fieldName', label: 'l2', value: 'v1', checked: true }
      ],
      attrs: {
        name: 'fieldName',
        type: 'checkbox'
      }
    }

    const vm = {
      fields,
      data: {},
      value: {},
      default: {},
      inputValues: {},
      changed (e) {
        wrapper.vm.$emit('change', e)
      },
      $emit: () => {}
    }

    loadFields(schema, fields)
    initFields(vm)

    const field = fields[0]

    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = '<label><span data-required-field="false">choices</span><fieldset name="fieldName"><legend>choices description</legend><div><label><span data-required-field="false">l1</span><input name="fieldName" type="checkbox" value="v0"><small>choices description</small></label><label><span data-required-field="false">l2</span><input name="fieldName" type="checkbox" value="v1" checked="checked"><small>choices description</small></label></div></fieldset><small>choices description</small></label>'

    expect(wrapper.html()).toEqual(expected)

    // component
    field.items.map((item) => item.value).forEach((value, i) => {
      const input = wrapper.findAll('label').at(i).find('input')

      expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])
    })

    // event
    const input = wrapper.find('input')
    const input1 = wrapper.findAll('input').at(1)

    expect(vm.data).toEqual({ fieldName: [ 'v1' ] })

    input.trigger('click')

    expect(Object.keys(wrapper.emitted())).toEqual(['input', 'change'])
    expect(vm.data).toEqual({ fieldName: [ 'v0', 'v1' ] })

    input1.trigger('click')

    expect(vm.data).toEqual({ fieldName: [ 'v0' ] })
  })

  it('should successfully render the component with field.attrs.type === select and items', () => {
    const fields = []
    const schema = {
      type: 'array',
      title: 'choices',
      description: 'choices description',
      enum: [
        { name: 'fieldName', label: 'l1', value: 'v0' },
        { name: 'fieldName', label: 'l2', value: 'v1', selected: true }
      ],
      attrs: {
        name: 'fieldName'
      }
    }

    const vm = {
      fields,
      data: {},
      value: {},
      default: {},
      inputValues: {},
      changed (e) {
        wrapper.vm.$emit('change', e)
      },
      $emit: () => {}
    }

    loadFields(schema, fields)
    initFields(vm)

    const field = fields[0]

    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    vm.$emit = wrapper.vm.$emit

    expect(wrapper.findAll('fieldset').length).toEqual(0)
    expect(wrapper.findAll('legend').length).toEqual(0)
    expect(wrapper.findAll('div').length).toEqual(0)
    expect(wrapper.findAll('label').length).toEqual(1)
    expect(wrapper.findAll('span').length).toEqual(1)
    expect(wrapper.findAll('select').length).toEqual(1)
    expect(wrapper.findAll('option').length).toEqual(3)

    // label
    const label = wrapper.find('label')

    expect(label.findAll('span').length).toEqual(1)
    expect(label.find('span').text()).toEqual(schema.title)

    // options
    const options = label.find('select').findAll('option')
    const items = [ ...field.items ]

    items.unshift({ label: '', value: '' })
    items.forEach((item, i) => {
      const option = options.at(i)

      expect(option.is('option')).toBe(true)
      expect(option.isEmpty()).toBe(item.value.length === 0)
      expect(Object.keys(option.vnode.data.on)).toEqual(['input', 'change'])

      expect(option.element.hasAttribute('type')).toBe(false)

      expect(option.element.hasAttribute('name')).toBe(false)
      expect(option.element.textContent).toEqual(item.label)

      expect(option.element.hasAttribute('value')).toBe(true)
      expect(option.element.getAttribute('value')).toEqual(item.value)

      expect(option.element.hasAttribute('selected'))
        .toBe(vm.data[schema.attrs.name] === item.value)
    })

    expect(vm.data).toEqual({ fieldName: 'v1' })
  })

  it('should successfully render the component with field.attrs.type === select and required field', () => {
    const fields = []
    const name = 'fieldName'
    const schema = {
      type: 'object',
      properties: {
        [name]: {
          type: 'array',
          enum: [
            { label: 'l1', value: 'v0' },
            { label: 'l2', value: 'v1', selected: true }
          ]
        }
      },
      required: [name]
    }

    const vm = {
      fields,
      data: {},
      value: {},
      default: {},
      inputValues: {},
      changed (e) {
        wrapper.vm.$emit('change', e)
      },
      $emit: () => {}
    }

    loadFields(schema, fields)
    initFields(vm)

    const field = fields[0]

    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    vm.$emit = wrapper.vm.$emit

    expect(wrapper.findAll('fieldset').length).toEqual(0)
    expect(wrapper.findAll('legend').length).toEqual(0)
    expect(wrapper.findAll('div').length).toEqual(0)
    expect(wrapper.findAll('label').length).toEqual(0)
    expect(wrapper.findAll('span').length).toEqual(0)
    expect(wrapper.findAll('select').length).toEqual(1)
    expect(wrapper.findAll('option').length).toEqual(2)

    // options
    const options = wrapper.find('select').findAll('option')

    field.items.forEach((item, i) => {
      const option = options.at(i)

      expect(option.is('option')).toBe(true)
      expect(option.isEmpty()).toBe(item.value.length === 0)
      expect(Object.keys(option.vnode.data.on)).toEqual(['input', 'change'])

      expect(option.element.hasAttribute('type')).toBe(false)

      expect(option.element.hasAttribute('name')).toBe(false)
      expect(option.element.textContent).toEqual(item.label)

      expect(option.element.hasAttribute('value')).toBe(true)
      expect(option.element.getAttribute('value')).toEqual(item.value)

      expect(option.element.hasAttribute('selected'))
        .toBe(vm.data[name] === item.value)
    })
  })

  it('should successfully emit input event', () => {
    const field = {
      attrs: {
        type: 'text',
        name: 'fieldName',
        value: 'Hello'
      },
      itemsNum: 2
    }
    const vm = {
      inputValues: {
        'fieldName': 'Hello'
      },
      data: {
        fieldName: 'Hello'
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = {
      fieldName: 'Sébastien'
    }
    const input = wrapper.find('input')

    input.element.value = 'Sébastien'
    input.trigger('input')

    expect(wrapper.emitted().input[0][0]).toEqual(expected)
    expect(vm.data).toEqual(expected)
  })

  it('should successfully emit input event with an empty value', () => {
    const field = {
      attrs: {
        type: 'text',
        name: 'fieldName',
        value: 'Hello'
      }
    }
    const vm = {
      inputValues: {
        'fieldName': 'Hello'
      },
      data: {
        fieldName: 'Hello'
      },
      changed (e) {
        wrapper.vm.$emit('change', e)
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, vm }
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = {
      fieldName: ''
    }
    const input = wrapper.find('input')

    input.element.value = ''
    input.trigger('input')

    expect(wrapper.emitted().input[0][0]).toEqual(expected)
    expect(vm.data).toEqual(expected)
  })
})
