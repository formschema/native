'use strict'

import { mount } from 'vue-test-utils'
import component from '../../src/components/FormSchemaInputDescription.js'

/* global describe it expect */

describe('component', () => {
  it('should a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const wrapper = mount(component, {
      context: {
        props: {
          field: {
            description: 'Hello'
          }
        }
      }
    })

    expect(wrapper.html()).toEqual('<small>Hello</small>')
  })

  it('should successfully render with an undefined description', () => {
    const wrapper = mount(component, {
      context: {
        props: {
          field: {}
        }
      }
    })

    expect(wrapper.html()).toEqual(undefined)
  })
})
