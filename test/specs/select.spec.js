'use strict'

import Vue from 'vue'
import Select from '../../components/select.vue'

const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false
const DEFAULT_MULTIPLE = false

const PROP_NAME = 'usergender'
const PROP_VALUE = 'male'
const PROP_PLACEHOLDER = 'your gender'
const PROP_MULTIPLE = 'multiple'

/* global describe it expect */

describe('Select.vue', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof Select.created).toBe('function')
  })

  it('has a invalid method', () => {
    expect(typeof Select.methods.invalid).toBe('function')
  })

  it('has a input method', () => {
    expect(typeof Select.methods.input).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof Select.data).toBe('function')
    const defaultData = Select.data()

    expect(defaultData.initialValue).toBe(null)
    expect(defaultData.hasError).toBe(false)
  })

  // Inspect the component instance on mount
  it('mount component with default props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(Select)
    const component = new Constructor({
      propsData: {
        name: PROP_NAME,
        value: PROP_VALUE
      }
    }).$mount()

    const attr = (name) => component.$el.getAttribute(name)

    expect(attr('name')).toBe(PROP_NAME)
    expect(component.value).toBe(PROP_VALUE)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
    expect(component.multiple).toBe(DEFAULT_MULTIPLE)
  })

  it('correctly sets props', () => {
    const Constructor = Vue.extend(Select)
    const component = new Constructor({
      propsData: {
        name: PROP_NAME,
        value: PROP_VALUE,
        placeholder: PROP_PLACEHOLDER,
        multiple: PROP_MULTIPLE
      }
    }).$mount()

    const attr = (name) => component.$el.getAttribute(name)
    
    expect(attr('name')).toBe(PROP_NAME)
    expect(component.value).toBe(PROP_VALUE)
    expect(component.$el.options[0].text).toBe(PROP_PLACEHOLDER)
    expect(attr('multiple')).toBe(PROP_MULTIPLE)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
  })
})
