'use strict'

import { mount } from '@vue/test-utils'
import { init, input as getInput } from '@/lib/components'

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
        type: 'text',
        name: 'fieldName',
        value: 'Hello'
      }
    }
    const input = getInput({ field })
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
    const expected = '<input type="text" name="fieldName" value="Hello">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with non scalar value', () => {
    const field = {
      attrs: {
        type: 'text',
        name: 'fieldName',
        value: 'Hello'
      }
    }
    const input = getInput({ field })
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
    const expected = '<input type="text" name="fieldName" value="Hello">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with missing name attr', () => {
    const field = {
      attrs: {
        type: 'text',
        name: 'fieldName',
        value: 'Hello'
      }
    }
    const input = getInput({ field })
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
    const expected = '<input type="text" name="fieldName" value="Hello">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })
})
