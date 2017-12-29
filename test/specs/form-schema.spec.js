'use strict'

import Vue from 'vue'

import FormSchema from '../../component.vue'
import schema from '../fixtures/signup'

Vue.config.productionTip = false

/* global describe it expect */

describe('component', () => {
  it('should have a created hook', () => {
    expect(typeof FormSchema.created).toBe('function')
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
    propsData: { schema, model }
  }).$mount()

  const form = component.$el.getElementsByTagName('form')[0]
  const inputs = form.elements
  const button = form.getElementsByTagName('button')[0]

  const attr = (input, name) => input.getAttribute(name)

  const clonedSchema = JSON.parse(JSON.stringify(schema))

  for (let fieldName in clonedSchema.properties) {
    const field = clonedSchema.properties[fieldName]

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

    for (let attrName in field.attrs) {
      it(`input.${fieldName} should have attribute '${attrName}'`, () => {
        if (typeof field.attrs[attrName] === 'boolean') {
          if (field.attrs[attrName] === true) {
            return expect(attr(input, attrName)).toEqual(attrName)
          }

          return expect(attr(input, attrName)).toEqual(null)
        }

        return expect(attr(input, attrName))
          .toMatch(new RegExp(`${field.attrs[attrName]}`))
      })
    }
  }

  it('should have a submit button', () =>
    expect(attr(button, 'type')).toBe('submit'))

  it('should have a button with Submit label', () =>
    expect(button.innerText).toBe('Submit'))
})
