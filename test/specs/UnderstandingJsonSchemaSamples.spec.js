'use strict'

import { mount } from '@vue/test-utils'

import component from '@/components/FormSchema.js'

/* global describe it expect */

/**
 * This add type-specific keywords test cases according
 * Space Telescope Science Institute's website Understanding JSON Schema
 *
 * @see https://spacetelescope.github.io/understanding-json-schema/reference/type.html
 */

describe('Understanding JSON Schema Types Samples', () => {
  describe('string', () => {
    describe('', () => {
      const schema = { "type": "string" }

      it('should render default value with an empty schema', () => {
        const wrapper = mount(component, {
          propsData: { schema }
        })

//         expect(wrapper.emitted().input).toEqual(undefined)
      })
    })
  })
})
