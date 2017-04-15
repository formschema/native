'use strict'

import Vue from 'vue'
import FileInput from '../../components/fileinput.vue'

const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false

/* global describe it expect */

describe('FileInput.vue', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof FileInput.created).toBe('function')
  })

  it('has a invalid method', () => {
    expect(typeof FileInput.methods.invalid).toBe('function')
  })

  it('has a input method', () => {
    expect(typeof FileInput.methods.input).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof FileInput.data).toBe('function')
    const defaultData = FileInput.data()

    expect(defaultData.initialValue).toBe(null)
    expect(defaultData.hasError).toBe(false)
  })

  // Inspect the component instance on mount
  it('correctly sets props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(FileInput)

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
