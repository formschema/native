'use strict'

import Vue from 'vue'
import FormSchema from '../../components/form-schema.vue'

import SignupSchema from '../fixtures/signup'

/* global describe it expect */

describe('FormSchema', () => {
  // Inspect the raw component options
  it('should have a created hook', () => {
    expect(typeof FormSchema.created).toBe('function')
  })

  it('should have a mounted hook', () => {
    expect(typeof FormSchema.mounted).toBe('function')
  })

  it('should have a submit method', () => {
    expect(typeof FormSchema.methods.submit).toBe('function')
  })

  it('should have a reset method', () => {
    expect(typeof FormSchema.methods.reset).toBe('function')
  })

  it('should have a alertClosed method', () => {
    expect(typeof FormSchema.methods.alertClosed).toBe('function')
  })

  it('should have a setErrorMessage method', () => {
    expect(typeof FormSchema.methods.setErrorMessage).toBe('function')
  })

  it('should have a input method', () => {
    expect(typeof FormSchema.methods.input).toBe('function')
  })

  // Evaluate the results of functions in
  // the raw component options
  it('should set the correct default data', () => {
    expect(typeof FormSchema.data).toBe('function')
    const defaultData = FormSchema.data()

    expect(Object.keys(defaultData.default).length).toBe(0)
    expect(defaultData.fields.length).toBe(0)
    expect(defaultData.error).toBe(null)
  })

  // Inspect the component instance on mount
  it('should correctly set props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(FormSchema)
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
  })
})
