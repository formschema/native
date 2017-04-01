'use strict'

import Vue from 'vue'
import Textarea from '../../components/textarea.vue'

const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false

/* global describe it expect */

describe('Textarea.vue', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof Textarea.created).toBe('function')
  })

  it('has a invalid method', () => {
    expect(typeof Textarea.methods.invalid).toBe('function')
  })

  it('has a input method', () => {
    expect(typeof Textarea.methods.input).toBe('function')
  })

  it('has a keyup method', () => {
    expect(typeof Textarea.methods.keyup).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof Textarea.data).toBe('function')
    const defaultData = Textarea.data()

    expect(defaultData.initialValue).toBe(null)
    expect(defaultData.hasError).toBe(false)
  })

  // Inspect the component instance on mount
  it('correctly sets props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(Textarea)

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

    const attr = (name) => component.$el.getAttribute(name)

    expect(attr('name')).toBe(PROP_NAME)
    expect(component.value).toBe(PROP_VALUE)
    expect(parseInt(attr('rows'))).toBe(PROP_ROWS)
    expect(attr('placeholder')).toBe(PROP_PLACEHOLDER)
    expect(parseInt(attr('maxlength'))).toBe(PROP_MAXLENGTH)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
  })
})
