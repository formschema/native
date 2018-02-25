'use strict'

import { mount } from '@vue/test-utils'
import { init, components } from '@/lib/components'

import component from '@/components/FormSchemaInputArrayElement.js'

/* global describe it expect */

init()

describe('FormSchemaInputArrayElement', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const field = {
      attrs: {
        name: 'fieldName'
      }
    }
    const input = {
      data: {
        attrs: {
          type: 'text',
          value: 'Hello'
        }
      },
      element: components.text,
      native: true
    }
    const name = field.attrs.name
    const vm = {
      inputValues: {
        [name]: 'Hello'
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, input, vm, name }
      }
    })
    const expected = '<input type="text" value="Hello" name="fieldName">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully emit input event', () => {
    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2
    }
    const input = {
      data: {
        attrs: {
          type: 'text'
        }
      },
      element: components.text,
      native: true
    }
    const name = `${field.attrs.name}-0`
    const vm = {
      inputValues: {
        'fieldName-0': 'Value 1',
        'fieldName-1': 'Value 2'
      },
      data: {
        fieldName: [
          'Value 1',
          'Value 2'
        ]
      },
      changed: () => {}
    }
    const wrapper = mount(component, {
      context: {
        props: { field, input, vm, name }
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = {
      fieldName: [
        'Hello',
        'Value 2'
      ]
    }
    const inputElement = wrapper.find('input')

    inputElement.element.value = 'Hello'
    inputElement.trigger('input')

    expect(wrapper.emitted().input[0][0]).toEqual(expected)
    expect(vm.data).toEqual(expected)
  })

  it('should successfully emit input event with an empty value', () => {
    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2
    }
    const input = {
      data: {
        attrs: {
          type: 'text'
        }
      },
      element: components.text,
      native: true
    }
    const name = `${field.attrs.name}-0`
    const vm = {
      inputValues: {
        'fieldName-0': 'Value 1',
        'fieldName-1': 'Value 2'
      },
      data: {
        fieldName: [
          'Value 1',
          'Value 2'
        ]
      },
      changed: () => {}
    }
    const wrapper = mount(component, {
      context: {
        props: { field, input, vm, name }
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = {
      fieldName: [
        'Value 2'
      ]
    }
    const inputElement = wrapper.find('input')

    inputElement.element.value = ''
    inputElement.trigger('input')

    expect(wrapper.emitted().input[0][0]).toEqual(expected)
    expect(vm.data).toEqual(expected)
  })
})
