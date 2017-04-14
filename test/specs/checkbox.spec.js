'use strict'

import Vue from 'vue'
import Checkbox from '../../components/checkbox.vue'

const DEFAULT_CHECKED = false
const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false

const PROP_NAME = 'gender'
const PROP_VALUE = 'male'
const PROP_LABEL = 'Male'
const PROP_TITLE = 'Are you a male?'
const PROP_CHECKED = true

/* global describe it expect */

describe('Checkbox.vue', () => {
  // Inspect the raw component options
  it('has a invalid method', () => {
    expect(typeof Checkbox.methods.invalid).toBe('function')
  })

  it('has a changed method', () => {
    expect(typeof Checkbox.methods.changed).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof Checkbox.data).toBe('function')
    const defaultData = Checkbox.data()

    expect(defaultData.hasError).toBe(false)
  })

  // Inspect the component instance on mount
  it('mount component with default props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(Checkbox)
    const component = new Constructor({
      propsData: {
        name: PROP_NAME,
        value: PROP_VALUE,
        label: PROP_LABEL,
        title: PROP_TITLE
      }
    }).$mount()

    const attr = (name) => {
      return component.$el.querySelector('input').getAttribute(name)
    }

    expect(attr('name')).toBe(PROP_NAME)
    expect(attr('title')).toBe(PROP_TITLE)
    expect(component.value).toBe(PROP_VALUE)
    expect(component.$el.textContent.trim()).toBe(PROP_LABEL)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
    expect(component.checked).toBe(DEFAULT_CHECKED)
  })

  it('correctly sets props', () => {
    const Constructor = Vue.extend(Checkbox)
    const component = new Constructor({
      propsData: {
        name: PROP_NAME,
        value: PROP_VALUE,
        label: PROP_LABEL,
        title: PROP_TITLE,
        checked: PROP_CHECKED
      }
    }).$mount()

    const attr = (name) => {
      return component.$el.querySelector('input').getAttribute(name)
    }

    expect(attr('name')).toBe(PROP_NAME)
    expect(attr('title')).toBe(PROP_TITLE)
    expect(component.value).toBe(PROP_VALUE)
    expect(component.$el.textContent.trim()).toBe(PROP_LABEL)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
    expect(component.required).toBe(DEFAULT_REQUIRED)
    expect(component.checked).toBe(PROP_CHECKED)
  })
})
