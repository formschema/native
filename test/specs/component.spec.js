'use strict'

import { mount } from 'vue-test-utils'
import FormSchema from '../../component.js'
import schema from '../fixtures/signup.json'

const schemaClone = JSON.parse(JSON.stringify(schema))

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

const schemaCase = (schema) => () => {
  const model = {}
  const wrapper = mount(FormSchema, {
    propsData: {
      schema, model
    }
  })
  const vm = wrapper.vm
  const attr = (input, name) => input.getAttribute(name)

  const clonedSchema = JSON.parse(JSON.stringify(vm.schemaLoaded))

  for (let fieldName in clonedSchema.properties) {
    const field = clonedSchema.properties[fieldName]
    const selector = `input[name="${fieldName}"]`

    if (field.visible === false) {
      it(`invisible input.${fieldName} should be undefined`, () => {
        expect(wrapper.contains(selector)).toBe(false)
      })
      continue
    }

    it(`should contain ${selector}`, () => {
      expect(wrapper.contains(selector)).toBe(true)
    })

    const input = wrapper.find(selector).element

    if (!field.attrs) {
      field.attrs = {}
    }

    field.attrs.name = fieldName

    if (field.type === 'boolean') {
      field.attrs.type = 'checkbox'
    }

    for (let attrName in field.attrs) {
      if (typeof field.attrs[attrName] === 'boolean') {
        if (field.attrs[attrName] === true) {
          it(`input.${fieldName} should have attribute '${attrName}'`, () => {
            return expect(attr(input, attrName)).toEqual(attrName)
          })
        } else {
          it(`input.${fieldName} should not have attribute '${attrName}'`, () => {
            return expect(attr(input, attrName)).toEqual(null)
          })
        }
      } else {
        it(`input.${fieldName} should have attribute '${attrName}'`, () => {
          return expect(attr(input, attrName))
            .toMatch(new RegExp(`${field.attrs[attrName]}`))
        })
      }
    }
  }

  it('should have a button', () => {
    expect(wrapper.contains('button')).toBe(true)
  })

  it('should have a submit button', () => {
    expect(wrapper.find('button').element.getAttribute('type')).toBe('submit')
  })

  it('should have a button with Submit label', () => {
    expect(wrapper.find('button').text()).toBe('Submit')
  })
}

describe('schema', schemaCase(schema))
describe('async schema', schemaCase(Promise.resolve(schemaClone)))
