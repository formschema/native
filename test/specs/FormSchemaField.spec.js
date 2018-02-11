'use strict'

import { mount } from '@vue/test-utils'
import { loadFields } from '../../src/lib/parser'
import { init, set, initFields, inputName } from '../../src/lib/components'

import component from '../../src/components/FormSchemaField.js'

/* global describe it expect */

init()

describe('component', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
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

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(1)
    expect(wrapper.find('form').findAll('label').length).toEqual(0)

    const input = wrapper.find('input')

    expect(input.is('input')).toBe(true)
    expect(input.isEmpty()).toBe(true)
    expect(input.vnode.data.ref).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.name).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.type).toEqual('text')
    expect(input.vnode.data.attrs.value).toEqual(field.attrs.value)
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

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(1)
    expect(wrapper.find('form').findAll('label').length).toEqual(0)

    const input = wrapper.find('input')

    expect(input.is('input')).toBe(true)
    expect(input.isEmpty()).toBe(true)
    expect(input.vnode.data.ref).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.name).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.type).toEqual('text')
    expect(input.vnode.data.attrs.value).toEqual(field.attrs.value)
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

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('textarea').length).toEqual(1)
    expect(wrapper.find('form').findAll('label').length).toEqual(0)

    const textarea = wrapper.find('textarea')

    // component
    expect(textarea.is('textarea')).toBe(true)
    expect(textarea.isEmpty()).toBe(true)
    expect(textarea.vnode.data.ref).toEqual(field.attrs.name)
    expect(textarea.vnode.data.attrs.name).toEqual(field.attrs.name)
    expect(Object.keys(textarea.vnode.data.on)).toEqual(['input', 'change'])

    // render
    expect(textarea.html()).toEqual('<textarea name="fieldName">Hello</textarea>')

    // event
    textarea.element.innerHTML = 'Sébastien'

    expect(textarea.html()).toEqual('<textarea name="fieldName">Sébastien</textarea>')

    // custom element
    set('textarea', 'textarea', { type: 'text' })
    const custom = mount(form)

    expect(custom.findAll('form').length).toEqual(1)
    expect(custom.find('form').findAll('textarea').length).toEqual(1)
    expect(custom.find('form').findAll('label').length).toEqual(0)

    const customInput = custom.find('form').find('textarea')

    expect(customInput.html()).toEqual('<textarea></textarea>')
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

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(1)
    expect(wrapper.find('form').findAll('label').length).toEqual(0)

    const input = wrapper.find('input')

    // component
    expect(input.is('input')).toBe(true)
    expect(input.isEmpty()).toBe(true)
    expect(input.vnode.data.ref).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.name).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.type).toEqual(field.attrs.type)
    expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

    // render
    expect(input.html()).toEqual('<input type="radio" name="fieldName" value="Hello">')

    // event
    input.element.value = 'Sébastien'

    expect(input.html()).toEqual('<input type="radio" name="fieldName" value="Sébastien">')
  })

  it('should successfully render the component with field.attrs.type === radio and items', () => {
    const field = {
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
      changed: (e) => {
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

    vm.$emit = wrapper.vm.$emit

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('div').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(2)
    expect(wrapper.find('form').findAll('label').length).toEqual(0)

    // component
    const elements = wrapper.findAll('input')

    field.items.map((item) => item.value).forEach((value, i) => {
      const input = elements.at(i)

      expect(input.is('input')).toBe(true)
      expect(input.isEmpty()).toBe(true)
      expect(input.vnode.data.ref).toEqual(field.attrs.name)
      expect(input.vnode.data.attrs.name).toEqual(field.attrs.name)
      expect(input.vnode.data.attrs.type).toEqual(field.attrs.type)
      expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

      // attrs
      expect(input.element.hasAttribute('name')).toBe(true)
      expect(input.element.getAttribute('name')).toEqual(field.attrs.name)

      expect(input.element.hasAttribute('type')).toBe(true)
      expect(input.element.getAttribute('type')).toEqual(field.attrs.type)

      expect(input.element.hasAttribute('value')).toBe(true)
      expect(input.element.getAttribute('value')).toEqual(value)

      expect(input.element.hasAttribute('checked'))
        .toBe(value === vm.data[field.attrs.name])
    })

    // event
    const input = wrapper.find('input')
    const expected = {
      fieldName: input.element.value
    }

    input.trigger('click')

    expect(Object.keys(wrapper.emitted())).toEqual(['input', 'change'])
    expect(vm.data).toEqual(expected)
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
      inputValues: {}
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

    vm.$emit = wrapper.vm.$emit

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(1)
    expect(wrapper.find('form').findAll('label').length).toEqual(0)

    const input = wrapper.find('input')

    // component
    expect(input.is('input')).toBe(true)
    expect(input.isEmpty()).toBe(true)
    expect(input.vnode.data.ref).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.name).toEqual(field.attrs.name)
    expect(input.vnode.data.attrs.type).toEqual(field.attrs.type)
    expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

    // render
    expect(input.element.hasAttribute('name')).toBe(true)
    expect(input.element.getAttribute('name')).toEqual(field.attrs.name)

    expect(input.element.hasAttribute('type')).toBe(true)
    expect(input.element.getAttribute('type')).toEqual(field.attrs.type)

    expect(input.element.hasAttribute('value')).toBe(true)
    expect(input.element.getAttribute('value')).toEqual(field.attrs.value)

    expect(input.element.hasAttribute('checked')).toBe(false)
    expect(input.element.checked).toBe(false)

    // event
    const expected = {
      fieldName: input.element.value
    }

    input.element.dispatchEvent(new Event('click'))

    expect(input.element.checked).toBe(true)
    expect(Object.keys(wrapper.emitted())).toEqual(['input'])
    expect(vm.data).toEqual(expected)

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
      changed: (e) => {
        wrapper.vm.$emit('change', e)
      },
      $emit: () => {}
    }

    loadFields(schema, fields)
    initFields(vm)

    const field = fields[0]

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

    vm.$emit = wrapper.vm.$emit

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.findAll('fieldset').length).toEqual(1)
    expect(wrapper.findAll('legend').length).toEqual(1)
    expect(wrapper.findAll('div').length).toEqual(1)
    expect(wrapper.findAll('label').length).toEqual(2)
    expect(wrapper.findAll('span').length).toEqual(2)
    expect(wrapper.findAll('input').length).toEqual(2)

    expect(wrapper.find('fieldset').element.hasAttribute('name')).toBe(true)
    expect(wrapper.find('fieldset').element.getAttribute('name')).toEqual(schema.attrs.name)

    // component
    field.items.map((item) => item.value).forEach((value, i) => {
      // const name = schema.anyOf[i].name || schema.anyOf[i].label
      const name = inputName(field, i)
      const label = wrapper.find('form').findAll('label').at(i)

      expect(label.findAll('span').length).toEqual(1)
      expect(label.find('span').text()).toEqual(schema.anyOf[i].label)
      expect(label.findAll('input').length).toEqual(1)
      expect(label.element.hasAttribute('label')).toBe(false)

      const ref = inputName(field, i)
      const input = label.find('input')

      expect(input.is('input')).toBe(true)
      expect(input.isEmpty()).toBe(true)
      expect(input.vnode.data.ref).toEqual(ref)
      expect(input.vnode.data.attrs.name).toEqual(name)
      expect(input.vnode.data.attrs.type).toEqual(schema.attrs.type)
      expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

      // attrs
      expect(input.element.hasAttribute('name')).toBe(true)
      expect(input.element.getAttribute('name')).toEqual(name)

      expect(input.element.hasAttribute('type')).toBe(true)
      expect(input.element.getAttribute('type')).toEqual(schema.attrs.type)

      expect(input.element.hasAttribute('value')).toBe(true)
      expect(input.element.getAttribute('value')).toEqual(value)

      expect(input.element.hasAttribute('checked'))
        .toBe(vm.data[schema.attrs.name].includes(value))
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
      changed: (e) => {
        wrapper.vm.$emit('change', e)
      },
      $emit: () => {}
    }

    loadFields(schema, fields)
    initFields(vm)

    const field = fields[0]

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

    vm.$emit = wrapper.vm.$emit

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.findAll('fieldset').length).toEqual(0)
    expect(wrapper.findAll('legend').length).toEqual(0)
    expect(wrapper.findAll('div').length).toEqual(0)
    expect(wrapper.findAll('label').length).toEqual(1)
    expect(wrapper.findAll('span').length).toEqual(1)
    expect(wrapper.findAll('select').length).toEqual(1)
    expect(wrapper.findAll('option').length).toEqual(3)

    // label
    const label = wrapper.find('form').find('label')

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
      changed: (e) => {
        wrapper.vm.$emit('change', e)
      },
      $emit: () => {}
    }

    loadFields(schema, fields)
    initFields(vm)

    const field = fields[0]

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

    vm.$emit = wrapper.vm.$emit

    expect(wrapper.findAll('form').length).toEqual(1)
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
      changed: () => {}
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
      changed: () => {}
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
