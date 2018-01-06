'use strict'

import { equals } from '../../src/lib/object'

/* global describe it expect */

describe('lib/object', () => {
  describe('object.equals(o1, o2)', () => {
    it('should return false for inputs with not equal keys length', () => {
      const o1 = { a: 1 }
      const o2 = { a: 1, b: 2 }

      expect(equals(o1, o2)).toEqual(false)
    })

    it('should return false for different inputs with equal keys length', () => {
      const o1 = { a: 1, b: 3 }
      const o2 = { a: 1, b: 2 }

      expect(equals(o1, o2)).toEqual(false)
    })

    it('should return true for different inputs with equal ordered keys', () => {
      const o1 = { a: 1, b: 3 }
      const o2 = { a: 1, b: 3 }

      expect(equals(o1, o2)).toEqual(true)
    })

    it('should return true for different inputs with equal non ordered keys', () => {
      const o1 = { a: 1, b: 3 }
      const o2 = { b: 3, a: 1 }

      expect(equals(o1, o2)).toEqual(true)
    })

    it('should return true for empty inputs', () => {
      const o1 = {}
      const o2 = {}

      expect(equals(o1, o2)).toEqual(true)
    })
  })
})
