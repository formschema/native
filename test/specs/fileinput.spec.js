'use strict'

import Vue from 'vue'
import Input from '../../components/fileinput.vue'

const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false

/* global describe it expect */

describe('FileInput', () => {
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
    expect(defaultData.errorMessage).toBe(null)
  })

  // Inspect the component instance on mount
  it('correctly sets props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(Input)

    const PROP_NAME = 'image'
    const PROP_PLACEHOLDER = 'Select your photo'

    const component = new Constructor({
      propsData: {
        name: PROP_NAME,
        placeholder: PROP_PLACEHOLDER
      }
    }).$mount()

    const attr = (name) =>
      component.$el.getElementsByTagName('input')[0].getAttribute(name)

    expect(attr('name')).toBe(PROP_NAME)
    expect(attr('placeholder')).toBe(PROP_PLACEHOLDER)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
  })
})
