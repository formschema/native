'use strict'

import { mount } from 'vue-test-utils'
import { init, components, set } from '../../src/lib/components'
import component from '../../src/components/FormSchemaInput.js'

/* global describe it expect */

init()

describe('component', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const field = {}
    const input = {
      attrs: {
        name: 'fieldName',
        type: 'text',
        value: 'Hello'
      }
    }
    const element = components.text
    const vm = {
      inputValues: {
        [input.attrs.name]: 'Hello'
      }
    }
    const form = {
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { field, input, element, vm }
          })
        ])
      }
    }
    const wrapper = mount(form)
    const expected = '<form><input name="fieldName" type="text" value="Hello"><!----></form>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field component', () => {
    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = {
      ref: field.attrs.name,
      attrs: {
        name: field.attrs.name,
        type: 'text'
      }
    }
    const vm = {
      inputValues: {
        'fieldName-0': 'Value 1',
        'fieldName-1': 'Value 2'
      },
      data: {
        fieldName: []
      },
      changed: () => {}
    }
    const element = components.text
    const form = {
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { field, input, element, vm }
          })
        ])
      }
    }
    const wrapper = mount(form)

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(2)
    expect(wrapper.find('form').findAll('button').length).toEqual(1)

    const inputs = wrapper.findAll('input')
    let i = 0

    while (i < inputs.length) {
      const input = inputs.at(i)
      const name = `${field.attrs.name}-${i}`

      expect(input.is('input')).toBe(true)
      expect(input.isEmpty()).toBe(true)
      expect(input.vnode.data.ref).toEqual(name)
      expect(input.vnode.data.attrs.name).toEqual(name)
      expect(input.vnode.data.attrs.type).toEqual('text')
      expect(input.vnode.data.attrs.value).toEqual(vm.inputValues[name])
      expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

      i++
    }
  })

  it('should successfully render a array field for custom component', () => {
    set('text', 'input', { type: 'text' })

    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = {
      ref: field.attrs.name,
      attrs: {
        type: 'text'
      }
    }
    const vm = {
      inputValues: {
        'fieldName-0': 'Value 1',
        'fieldName-1': 'Value 2'
      },
      data: {
        fieldName: []
      },
      changed: () => {}
    }
    const element = components.text
    const form = {
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { field, input, element, vm }
          })
        ])
      }
    }
    const wrapper = mount(form)

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(2)
    expect(wrapper.find('form').findAll('button').length).toEqual(1)

    const inputs = wrapper.findAll('input')
    let i = 0

    while (i < inputs.length) {
      const input = inputs.at(i)
      const name = `${field.attrs.name}-${i}`

      expect(input.is('input')).toBe(true)
      expect(input.isEmpty()).toBe(true)
      expect(input.vnode.data.ref).toEqual(name)
      expect(input.vnode.data.attrs.type).toEqual('text')
      expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

      i++
    }
  })

  it('should successfully emit the click event', () => {
    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2,
      maxItems: 3,
      isArrayField: true
    }
    const input = {
      ref: field.attrs.name,
      attrs: {
        name: field.attrs.name,
        type: 'password'
      }
    }
    const vm = {
      inputValues: {
        'fieldName-0': 'Value 1',
        'fieldName-1': 'Value 2'
      },
      data: {
        fieldName: []
      },
      changed: () => {}
    }
    const element = components.password
    const form = {
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { field, input, element, vm }
          })
        ])
      }
    }
    const wrapper = mount(form)

    vm.$emit = wrapper.vm.$emit
    vm.$forceUpdate = wrapper.vm.$forceUpdate

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(2)
    expect(wrapper.find('form').findAll('button').length).toEqual(1)

    wrapper.find('button').trigger('click')

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(3)
    expect(wrapper.find('form').findAll('button').length).toEqual(1)

    wrapper.find('button').trigger('click')

    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.find('form').findAll('input').length).toEqual(3)
    expect(wrapper.find('form').findAll('button').length).toEqual(1)

    const inputs = wrapper.findAll('input')
    let i = 0

    while (i < inputs.length) {
      const input = inputs.at(i)
      const name = `${field.attrs.name}-${i}`

      expect(input.is('input')).toBe(true)
      expect(input.isEmpty()).toBe(true)
      expect(input.vnode.data.ref).toEqual(name)
      expect(input.vnode.data.attrs.name).toEqual(name)
      expect(input.vnode.data.attrs.type).toEqual('password')
      expect(input.vnode.data.attrs.value).toEqual(vm.inputValues[name])
      expect(Object.keys(input.vnode.data.on)).toEqual(['input', 'change'])

      i++
    }
  })
})
