'use strict'

import Vue from 'vue'
import Button from '../../components/button.vue'

const DEFAULT_TYPE = 'button'
const DEFAULT_LABEL = 'Button'
const DEFAULT_DISABLED = false

/* global describe it expect */

describe('Button.vue', () => {
  // Inspect the raw component options
  it('has a click method', () => {
    expect(typeof Button.methods.click).toBe('function')
  })

  // Inspect the component instance on mount
  it('mount component with default props', () => {
    // Extend the component to get the constructor, which we can then initialize directly.
    const Constructor = Vue.extend(Button)
    const component = new Constructor().$mount()
    const attr = (name) => component.$el.getAttribute(name)

    expect(attr('type')).toBe(DEFAULT_TYPE)
    expect(component.$el.innerText).toBe(DEFAULT_LABEL)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
  })

  // Inspect the component instance on mount
  it('correctly sets props', () => {
    const Constructor = Vue.extend(Button)

    const PROP_TYPE = 'submit'
    const PROP_LABEL = 'Publish'

    const component = new Constructor({
      propsData: {
        type: PROP_TYPE,
        label: PROP_LABEL
      }
    }).$mount()

    const attr = (name) => component.$el.getAttribute(name)

    expect(attr('type')).toBe(PROP_TYPE)
    expect(component.$el.innerText).toBe(PROP_LABEL)
    expect(component.disabled).toBe(DEFAULT_DISABLED)
  })
})
