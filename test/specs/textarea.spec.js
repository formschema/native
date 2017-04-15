'use strict'

import Vue from 'vue'
import Input from '../../components/textarea.vue'

const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false

/* global describe it expect */

describe('Textarea', () => {
  // Inspect the raw component options
  it('should have a created hook', () => {
    expect(typeof Input.created).toBe('function')
  })

  it('should have a invalid method', () => {
    expect(typeof Input.methods.invalid).toBe('function')
  })

  it('should have a input method', () => {
    expect(typeof Input.methods.input).toBe('function')
  })

  it('should have a keyup method', () => {
    expect(typeof Input.methods.keyup).toBe('function')
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
    expect(defaultData.errorMessage).toBe(null)
  })
})

describe('Input.vue: correctly sets props', () => {
  const Constructor = Vue.extend(Input)

  const PROP_NAME = 'content'
  const PROP_VALUE = 'Hello, World!'
  const PROP_PLACEHOLDER = 'Content'
  const PROP_ROWS = 5
  const PROP_MAXLENGTH = 144

  const component = new Constructor({
    propsData: {
      name: PROP_NAME,
      value: PROP_VALUE,
      rows: PROP_ROWS,
      placeholder: PROP_PLACEHOLDER,
      maxlength: PROP_MAXLENGTH
    }
  }).$mount()

  const input = () => component.$el.querySelector('textarea')
  const attr = (name) => input().getAttribute(name)

  it('should correctly set name prop', () =>
    expect(attr('name')).toBe(PROP_NAME))

  it('should correctly set value prop', () =>
    expect(input().value).toBe(PROP_VALUE))

  it('should correctly set rows prop', () =>
    expect(parseInt(attr('rows'))).toBe(PROP_ROWS))

  it('should correctly set placeholder prop', () =>
    expect(attr('placeholder')).toBe(PROP_PLACEHOLDER))

  it('should correctly set maxlength prop', () =>
    expect(parseInt(attr('maxlength'))).toBe(PROP_MAXLENGTH))

  it('should have default disabled prop value', () =>
    expect(component.disabled).toBe(DEFAULT_DISABLED))

  it('should have default required prop value', () =>
    expect(component.required).toBe(DEFAULT_REQUIRED))
})
