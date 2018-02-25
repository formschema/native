'use strict'

import { init, option, argName, inputName, components, elementOptions } from '@/lib/components'

/* global describe it expect beforeEach */

describe('lib/components', () => {
  describe('argName(el)', () => {
    it('should return "attrs" for native element', () => {
      expect(argName({ native: true })).toEqual('attrs')
    })

    it('should return "props" for custom element', () => {
      expect(argName({ native: false })).toEqual('props')
    })
  })

  describe('inputName(field, index)', () => {
    it('should successfully return the input name', () => {
      expect(inputName({ attrs: { name: 'fieldName' } }, 1)).toEqual('fieldName-1')
    })
  })

  describe('initFields(vm)', () => {
  })

  describe('input({ vm, field, ref })', () => {
  })

  describe('set(type, component, option = null, native = false)', () => {
  })

  describe('init()', () => {
    beforeEach(init)

    const divInputs = [
      'error', 'textgroup', 'defaultGroup'
    ]
    const fieldsetInputs = [
      'radiogroup', 'checkboxgroup'
    ]
    const tagInputs = ['form', 'textarea', 'select', 'option', 'label']
    const typedInputs = [
      'checkbox', 'color', 'date', 'datetime', 'datetime-local',
      'email', 'file', 'hidden', 'image', 'month', 'number',
      'password', 'radio', 'range', 'search', 'tel', 'text',
      'time', 'url', 'week'
    ]

    //     it('should contain the generic title component', () => {
    //       expect(components.title).toEqual({ component: 'h1', option })
    //     })
    //
    //     it('should contain the generic description component', () => {
    //       expect(components.description).toEqual({ component: 'p', option })
    //     })
    //
    //     it('should contain the generic error component', () => {
    //       expect(components.error).toEqual({ component: 'div', option })
    //     })
    //
    //     divInputs.forEach((tag) => {
    //       it(`should contain the generic div ${tag} component`, () => {
    //         expect(components[tag]).toEqual({ component: 'div', option })
    //       })
    //     })
    //
    //     fieldsetInputs.forEach((tag) => {
    //       it(`should contain the fieldset ${tag} component`, () => {
    //         expect({ ...components[tag], render: undefined }).toEqual({ component: 'fieldset', option })
    //       })
    //     })
    //
    //     tagInputs.forEach((tag) => {
    //       it(`should contain the generic tagged ${tag} component`, () => {
    //         expect(components[tag]).toEqual({ component: tag, option })
    //       })
    //     })
    //
    //     typedInputs.forEach((type) => {
    //       it(`should contain the generic typed ${type} component`, () => {
    //         const expected = {
    //           component: 'input',
    //           option: { ...option, type }
    //         }
    //
    //         expect(components[type]).toEqual(expected)
    //       })
    //     })
    //
    //     it('should contain the generic button component', () => {
    //       const expected = {
    //         component: 'button',
    //         option: { ...option, type: 'submit', label: 'Submit' }
    //       }
    //
    //       expect(components.button).toEqual(expected)
    //     })
    //
    //     it('should contain the generic arraybutton component', () => {
    //       const expected = {
    //         component: 'button',
    //         option: { ...option, type: 'button', label: 'Add' }
    //       }
    //
    //       expect(components.arraybutton).toEqual(expected)
    //     })
  })
})
