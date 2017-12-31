'use strict'

import { mount } from 'vue-test-utils'
import { init, set } from '../../lib/components'
import component from '../../src/FormSchemaButtons.js'

/* global describe it expect */

init()

describe('component', () => {
  it('should a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render a native component', () => {
    const wrapper = mount(component)
    const expected = '<div><button type="submit">Submit</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a custom component', () => {
    set('button', 'button')

    const wrapper = mount(component)
    const expected = '<label><button>Submit</button></label>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render with slots', () => {
    const wrapper = mount(component, {
      slots: {
        default: '<button>Submit</button>'
      }
    })
    const expected = '<label><button>Submit</button></label>'

    expect(wrapper.html()).toEqual(expected)
  })
})
