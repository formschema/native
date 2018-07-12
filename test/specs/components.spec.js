'use strict'

import {
  Components,
  argName,
  groupedArrayTypes,
  fieldTypesAsNotArray,
  inputName
} from '@/lib/components'

/* global describe it expect beforeEach */

describe('lib/components', () => {
  describe('Components()', () => {
    const defaultComponents = [
      'title', 'description', 'error', 'formwrapper',
      'form', 'text', 'option'
    ]

    describe('default components', () => {
      const instance = new Components()

      defaultComponents.forEach((type) => {
        describe(`component ${type}`, () => {
          it(`should have a right defined type`, () => {
            expect(instance.$[type].type).toEqual(type)
          })

          it(`should have native === true`, () => {
            expect(instance.$[type].native).toBeTruthy()
          })

          it(`should have a component entry defined`, () => {
            expect(instance.$[type].hasOwnProperty('component')).toBeTruthy()
          })

          if (typeof instance.$[type].component === 'object') {
            it(`should have a thruthy component.functional`, () => {
              expect(instance.$[type].component.functional).toBeTruthy()
            })

            it(`should have a render function`, () => {
              expect(typeof instance.$[type].component.render).toEqual('function')
            })
          }
        })
      })
    })

    describe('input({ vm, field, ref })', () => {
    })

    describe('set(type, component, option = null, native = false)', () => {
    })
  })

  describe('argName(el)', () => {
    it('should return "attrs" for native element', () => {
      expect(argName({ native: true })).toEqual('attrs')
    })

    it('should return "props" for custom element', () => {
      expect(argName({ native: false })).toEqual('props')
    })
  })

  describe('groupedArrayTypes', () => {
    it('should successfully export groupedArrayTypes', () => {
      expect(groupedArrayTypes).toEqual([
        'radio', 'checkbox', 'input', 'textarea'
      ])
    })
  })

  describe('fieldTypesAsNotArray', () => {
    it('should successfully export fieldTypesAsNotArray', () => {
      expect(fieldTypesAsNotArray).toEqual([
        'radio', 'textarea', 'select'
      ])
    })
  })

  describe('inputName(field, index)', () => {
    it('should successfully return the input name', () => {
      expect(inputName({ attrs: { name: 'fieldName' } }, 1)).toEqual('fieldName-1')
    })
  })
})
