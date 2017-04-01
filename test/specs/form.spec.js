'use strict'

import Vue from 'vue'
import Form from '../../components/form.vue'

import SignupSchema from '../fixtures/signup'

/* global describe it expect */

describe('Form.vue', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof Form.created).toBe('function')
  })

  it('has a mounted hook', () => {
    expect(typeof Form.mounted).toBe('function')
  })

  it('has a keyup method', () => {
    expect(typeof Form.methods.keyup).toBe('function')
  })

  it('has a submit method', () => {
    expect(typeof Form.methods.submit).toBe('function')
  })

  it('has a reset method', () => {
    expect(typeof Form.methods.reset).toBe('function')
  })

  it('has a alertClosed method', () => {
    expect(typeof Form.methods.alertClosed).toBe('function')
  })

  it('has a setErrorMessage method', () => {
    expect(typeof Form.methods.setErrorMessage).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('sets the correct default data', () => {
    expect(typeof Form.data).toBe('function')
    const defaultData = Form.data()

    expect(Object.keys(defaultData.default).length).toBe(0)
    expect(defaultData.fields.length).toBe(0)
    expect(defaultData.error).toBe(null)
  })

  // Inspect the component instance on mount
  it('correctly sets props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(Form)
    const model = {}
    const component = new Constructor({
      propsData: {
        schema: SignupSchema,
        model: model
      }
    }).$mount()

    const form = component.$el.getElementsByTagName('form')[0]
    const inputs = form.elements
    const button = form.getElementsByTagName('button')[0]

    const attr = (input, name) => input.getAttribute(name)

    for (let fieldName in SignupSchema.properties) {
      const field = SignupSchema.properties[fieldName]

      if (field.visible === false) {
        expect(inputs[fieldName]).toBe(undefined)
        continue
      }

      const input = inputs[fieldName]

      if (!field.attrs) {
        field.attrs = {}
      }

      field.attrs.name = fieldName

      if (field.type === 'boolean') {
        field.attrs.type = 'checkbox'
      }

      if (field.minLength) {
        field.attrs.minlength = field.minLength
      }

      if (field.maxLength) {
        field.attrs.maxlength = field.maxLength
      }

      if (field.required) {
        field.attrs.required = true
      }

      for (let attrName in field.attrs) {
        expect(attr(input, attrName)).toBe(`${field.attrs[attrName]}`)
      }
    }

    expect(attr(button, 'type')).toBe('submit')
    expect(button.innerText).toBe('Submit')

    console.log(model)
  })
})
