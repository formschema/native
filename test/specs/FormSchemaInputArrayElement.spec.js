'use strict'

import { mount } from '@vue/test-utils'
import { Components } from '@/lib/components'

import component from '@/components/FormSchemaInputArrayElement.js'

/* global describe it expect */

const components = new Components()

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
    const input = components.input({ field })
    const name = field.attrs.name
    const vm = {
      inputValues: {
      }
    }
    const value = 'Hello'
    const wrapper = mount(component, {
      context: {
        input,
        field,
        components,
        props: { value, name }
      }
    })
    const expected = '<input type="text" name="fieldName" value="Hello">'

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
    const input = components.input({ field })
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
        input,
        field,
        components,
        props: { value, name }
      }
    })
    const expected = '<input type="text" name="fieldName" value="Hello">'

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
    const input = components.input({ field })
    const vm = {
      inputValues: {
      }
    }
    const value = {
      [field.attrs.name]: 'Hello'
    }
    const wrapper = mount(component, {
      context: {
        input,
        field,
        components,
        props: { value }
      }
    })
    const expected = '<input type="text" name="fieldName" value="Hello">'

    expect(wrapper.html()).toEqual(expected)
  })
})
