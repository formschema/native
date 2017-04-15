'use strict'

import Vue from 'vue'
import Input from '../../components/select.vue'

const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false
const DEFAULT_MULTIPLE = false

const PROP_NAME = 'usergender'
const PROP_VALUE = 'male'
const PROP_PLACEHOLDER = 'your gender'
const PROP_MULTIPLE = 'multiple'

/* global describe it expect */

describe('Select', () => {
  // Inspect the raw component options
  it('should have a created hook', () => {
    expect(typeof Input.created).toBe('function')
  })

  it('should have a isEmpty method', () => {
    expect(typeof Input.methods.isEmpty).toBe('function')
  })

  it('should have a invalid method', () => {
    expect(typeof Input.methods.invalid).toBe('function')
  })

  it('should have a input method', () => {
    expect(typeof Input.methods.input).toBe('function')
  })

  it('should have a setError method', () => {
    expect(typeof Input.methods.setError).toBe('function')
  })

  it('should have a clearError method', () => {
    expect(typeof Input.methods.clearError).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('should set the correct default data', () => {
    expect(typeof Input.data).toBe('function')
    const defaultData = Input.data()

    expect(defaultData.initialValue).toBe(null)
    expect(defaultData.hasError).toBe(false)
    expect(defaultData.errorMessage).toBe(null)
  })
})

describe('Select: mount component with default props', () => {
  const Constructor = Vue.extend(Input)
  const component = new Constructor({
    propsData: {
      name: PROP_NAME,
      value: PROP_VALUE
    }
  }).$mount()

  it('should have default disabled prop value', () =>
    expect(component.disabled).toBe(DEFAULT_DISABLED))

  it('should have default required prop value', () =>
    expect(component.required).toBe(DEFAULT_REQUIRED))

  it('should have default required prop value', () =>
    expect(component.multiple).toBe(DEFAULT_MULTIPLE))
})

describe('Select: props usage', () => {
  const Constructor = Vue.extend(Input)
  const component = new Constructor({
    propsData: {
      name: PROP_NAME,
      value: PROP_VALUE,
      placeholder: PROP_PLACEHOLDER,
      multiple: PROP_MULTIPLE
    }
  }).$mount()

  const input = () => component.$el.querySelector('select')
  const attr = (name) => input().getAttribute(name)

  it('should correctly set name prop', () =>
    expect(attr('name')).toBe(PROP_NAME))

  it('should correctly set value prop', () =>
    expect(component.value).toBe(PROP_VALUE))

  it('should not be empty', () =>
    expect(component.isEmpty()).toBe(false))

  it('should correctly set placeholder prop', () =>
    expect(input().options[0].text).toBe(PROP_PLACEHOLDER))

  it('should correctly set multiple prop', () =>
    expect(attr('multiple')).toBe(PROP_MULTIPLE))

  it('should have default disabled prop value', () =>
    expect(component.required).toBe(DEFAULT_DISABLED))

  it('should have default required prop value', () =>
    expect(component.required).toBe(DEFAULT_REQUIRED))
})
