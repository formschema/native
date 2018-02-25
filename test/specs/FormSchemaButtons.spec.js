'use strict'

import { mount } from '@vue/test-utils'
import { init, set } from '@/lib/components'

import component from '@/components/FormSchemaButtons.js'

/* global describe it expect */

init()

describe('FormSchemaButtons', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render a native component', () => {
    const wrapper = mount(component)
    const expected = '<div><button type="submit">Submit</button></div>'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a custom component', () => {
    set('submitbutton', 'button', {
      domProps: { innerHTML: 'Submit' }
    })

    const wrapper = mount(component)
    const expected = '<div><button>Submit</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render with slots', () => {
    const wrapper = mount(component, {
      slots: {
        default: '<button>Submit</button>'
      }
    })
    const expected = '<div><button>Submit</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })
})
