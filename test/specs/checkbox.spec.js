'use strict'

import Vue from 'vue'
import Input from '../../components/checkbox.vue'

const DEFAULT_CHECKED = false
const DEFAULT_DISABLED = false
const DEFAULT_REQUIRED = false

const PROP_NAME = 'gender'
const PROP_VALUE = 'male'
const PROP_LABEL = 'Male'
const PROP_TITLE = 'Are you a male?'
const PROP_CHECKED = true

/* global describe it expect */

describe('Checkbox', () => {
  it('should have a invalid method', () => {
    expect(typeof Input.methods.invalid).toBe('function')
  })

  it('should have a changed method', () => {
    expect(typeof Input.methods.changed).toBe('function')
  })

  it('should have a setError method', () => {
    expect(typeof Input.methods.setError).toBe('function')
  })

  it('should have a clearError method', () => {
    expect(typeof Input.methods.clearError).toBe('function')
  })

  it('should set the correct default data', () => {
    expect(typeof Input.data).toBe('function')
    const defaultData = Input.data()

    expect(defaultData.errorMessage).toBe(null)
  })
})

describe('Checkbox: mount with default props', () => {
  const Constructor = Vue.extend(Input)
  const component = new Constructor({
    propsData: {
      name: PROP_NAME,
      value: PROP_VALUE,
      label: PROP_LABEL,
      title: PROP_TITLE
    }
  }).$mount()

  it('should have default disabled prop value', () =>
    expect(component.disabled).toBe(DEFAULT_DISABLED))

  it('should have default required prop value', () =>
    expect(component.required).toBe(DEFAULT_REQUIRED))

  it('should have default checked prop value', () =>
    expect(component.checked).toBe(DEFAULT_CHECKED))
})

describe('Checkbox: mount with user props', () => {
  const Constructor = Vue.extend(Input)
  const component = new Constructor({
    propsData: {
      name: PROP_NAME,
      value: PROP_VALUE,
      label: PROP_LABEL,
      title: PROP_TITLE,
      checked: PROP_CHECKED
    }
  }).$mount()

  const input = () => component.$el.querySelector('input')
  const attr = (name) => input().getAttribute(name)

  it('should correctly set name prop', () =>
    expect(attr('name')).toBe(PROP_NAME))

  it('should correctly set title prop', () =>
    expect(attr('title')).toBe(PROP_TITLE))

  it('should correctly set value prop', () =>
    expect(component.value).toBe(PROP_VALUE))

  it('should correctly set label', () =>
    expect(component.$el.textContent.trim()).toBe(PROP_LABEL))

  it('should have default disabled prop value', () =>
    expect(component.disabled).toBe(DEFAULT_DISABLED))

  it('should have default required prop value', () =>
    expect(component.required).toBe(DEFAULT_REQUIRED))

  it('should correctly set checked prop', () =>
    expect(component.checked).toBe(PROP_CHECKED))
})
