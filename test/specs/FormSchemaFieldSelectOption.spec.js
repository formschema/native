'use strict'

import { mount } from '@vue/test-utils'
import { Components } from '@/lib/components'

import component from '@/components/FormSchemaFieldSelectOption.js'

/* global describe beforeEach it expect */

let option
const components = new Components()

describe('FormSchemaFieldSelectOption', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  beforeEach(() => {
    option = {
      label: 'option label',
      value: 'option value'
    }
  })

  it('should successfully render the component', () => {
    const wrapper = mount(component, {
      context: {
        props: { option, components }
      }
    })

    const expected = '<option value="option value">option label</option>'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with explicit option.selected', () => {
    option.selected = true

    const wrapper = mount(component, {
      context: {
        props: { option, components }
      }
    })

    const expected = '<option value="option value" selected="selected">option label</option>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render the component with explicit selected value', () => {
    const value = option.value
    const wrapper = mount(component, {
      context: {
        props: { option, value, components }
      }
    })

    const expected = '<option value="option value" selected="selected">option label</option>'

    expect(wrapper.html()).toEqual(expected)
  })
})
