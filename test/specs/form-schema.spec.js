'use strict'

import Vue from 'vue'
import FormSchema from '../../component.vue'
import Schema from '../fixtures/signup'

/* global describe it expect */

describe('component', () => {
  it('should have a created hook', () => {
    expect(typeof FormSchema.created).toBe('function')
  })

  it('should have a mounted hook', () => {
    expect(typeof FormSchema.mounted).toBe('function')
  })

  it('should have a changed method', () => {
    expect(typeof FormSchema.methods.changed).toBe('function')
  })

  it('should have a input method', () => {
    expect(typeof FormSchema.methods.input).toBe('function')
  })

  it('should have a reset method', () => {
    expect(typeof FormSchema.methods.reset).toBe('function')
  })

  it('should have a submit method', () => {
    expect(typeof FormSchema.methods.submit).toBe('function')
  })

  it('should have a setErrorMessage method', () => {
    expect(typeof FormSchema.methods.setErrorMessage).toBe('function')
  })

  it('should have a clearErrorMessage method', () => {
    expect(typeof FormSchema.methods.clearErrorMessage).toBe('function')
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
})

describe('schema', () => {
  const Constructor = Vue.extend(FormSchema)
  const model = {}
  const component = new Constructor({
    propsData: {
      schema: Schema,
      model: model
    }
  }).$mount()

  const form = component.$el.getElementsByTagName('form')[0]
  const inputs = form.elements
  const button = form.getElementsByTagName('button')[0]

  const attr = (input, name) => input.getAttribute(name)

  for (let fieldName in Schema.properties) {
    const field = Schema.properties[fieldName]

    if (field.visible === false) {
      it(`invisible input.${fieldName} should be undefined`, () =>
        expect(inputs[fieldName]).toBe(undefined))
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

      if (field.attrs.placeholder) {
//         field.attrs.placeholder += ' *'
      }
    }

    for (let attrName in field.attrs) {
      it(`input.${fieldName} should have attribute '${attrName}'`, () =>
        expect(attr(input, attrName)).toMatch(new RegExp(`${field.attrs[attrName]}`)))
    }
  }

  it('should have a submit button', () =>
    expect(attr(button, 'type')).toBe('submit'))

  it('should have a button with Submit label', () =>
    expect(button.innerText).toBe('Submit'))
})
