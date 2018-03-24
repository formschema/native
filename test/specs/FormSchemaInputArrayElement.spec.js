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

  it('should successfully render the component with scalar value', () => {
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
      }
    }
    const value = 'Hello'
    const wrapper = mount(component, {
      context: {
        props: { field, value, input, name }
      }
    })
    const expected = '<input type="text" value="Hello" name="fieldName">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with non scalar value', () => {
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
      }
    }
    const value = {
      [name]: 'Hello'
    }
    const wrapper = mount(component, {
      context: {
        props: { field, value, input, name }
      }
    })
    const expected = '<input type="text" value="Hello" name="fieldName">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with missing name attr', () => {
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
    const vm = {
      inputValues: {
      }
    }
    const value = {
      [field.attrs.name]: 'Hello'
    }
    const wrapper = mount(component, {
      context: {
        props: { field, value, input }
      }
    })
    const expected = '<input type="text" value="Hello" name="fieldName">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })
})
