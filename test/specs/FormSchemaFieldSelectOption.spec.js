'use strict'

import { mount } from '@vue/test-utils'
import { init, initFields } from '@/lib/components'

import component from '@/components/FormSchemaFieldSelectOption.js'

/* global describe beforeEach it expect */

init()

let vm, option

describe('FormSchemaFieldSelectOption', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  beforeEach(() => {
    vm = {
      fields: [
        {
          attrs: {
            type: 'option'
          }
        }
      ],
      data: {},
      value: {},
      default: {},
      inputValues: {},
      changed: (e) => {},
      $emit: () => {}
    }

    initFields(vm)

    option = {
      label: 'option label',
      value: 'option value'
    }
  })

  it('should successfully render the component', () => {
    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: {
              vm, option
            }
          })
        ])
      }
    })

    const expected = '<option value="option value">option label</option>'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.find('option').html()).toEqual(expected)
  })

  it('should successfully render the component with explicit option.selected', () => {
    option.selected = true

    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: {
              vm, option
            }
          })
        ])
      }
    })

    const expected = '<option value="option value" selected="selected">option label</option>'

    expect(wrapper.find('option').html()).toEqual(expected)
  })
})
