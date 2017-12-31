'use strict'

import { mount } from 'vue-test-utils'
import { init, components } from '../../lib/components'
import component from '../../src/FormSchemaInputArrayElement.js'

/* global describe it expect */

init()

describe('component', () => {
  it('should a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const field = {
      attrs: {
        name: 'fieldName'
      }
    }
    const input = {
      ref: 'field-0',
      attrs: {
        type: 'text',
        value: 'Hello'
      }
    }
    const element = components.text
    const ref = field.attrs.name
    const vm = {
      inputValues: {
        [ref]: 'Hello'
      }
    }
    const wrapper = mount(component, {
      context: {
        props: { field, input, element, vm, ref }
      }
    })
    const expected = '<input type="text" value="Hello" name="fieldName">'

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
      ref: 'fieldName-0',
      attrs: {
        type: 'text'
      }
    }
    const element = components.text
    const ref = `${field.attrs.name}-0`
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
        props: { field, input, element, vm, ref }
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
      ref: 'fieldName-0',
      attrs: {
        type: 'text'
      }
    }
    const element = components.text
    const ref = `${field.attrs.name}-0`
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
        props: { field, input, element, vm, ref }
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
