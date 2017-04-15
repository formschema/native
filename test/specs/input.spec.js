'use strict'

import Vue from 'vue'
import Input from '../../components/input.vue'

const DEFAULT_TYPE = 'text'
const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false
const DEFAULT_AUTOCOMPLETE = null

const PROP_TYPE = 'email'
const PROP_NAME = 'useremail'
const PROP_VALUE = 'test@example.com'
const PROP_PLACEHOLDER = 'your email'
const PROP_MAXLENGTH = 80

/* global describe it expect */

describe('Input', () => {
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
    expect(defaultData.hasError).toBe(false)
    expect(defaultData.errorMessage).toBe(null)
  })

  // Inspect the component instance on mount
  it('mount component with default props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(Input)
    const component = new Constructor({
      propsData: {
        name: PROP_NAME,
        value: PROP_VALUE
      }
    }).$mount()

    const input = () => component.$el.querySelector('input')
    const attr = (name) => input().getAttribute(name)

    expect(attr('type')).toBe(DEFAULT_TYPE)
    expect(attr('name')).toBe(PROP_NAME)
    expect(input().value).toBe(PROP_VALUE)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
    expect(component.autocomplete).toBe(DEFAULT_AUTOCOMPLETE)
  })

  it('correctly sets props', () => {
    const Constructor = Vue.extend(Input)
    const component = new Constructor({
      propsData: {
        type: PROP_TYPE,
        name: PROP_NAME,
        value: PROP_VALUE,
        placeholder: PROP_PLACEHOLDER,
        maxlength: PROP_MAXLENGTH
      }
    }).$mount()

    const input = () => component.$el.querySelector('input')
    const attr = (name) => input().getAttribute(name)

    expect(attr('type')).toBe(PROP_TYPE)
    expect(attr('name')).toBe(PROP_NAME)
    expect(input().value).toBe(PROP_VALUE)
    expect(attr('placeholder')).toBe(PROP_PLACEHOLDER)
    expect(parseInt(attr('maxlength'))).toBe(PROP_MAXLENGTH)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
    expect(component.autocomplete).toBe(DEFAULT_AUTOCOMPLETE)
  })
})
