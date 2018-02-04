'use strict'

import { mount } from 'vue-test-utils'
import { loadFields } from '../../src/lib/parser'
import { init, initFields } from '../../src/lib/components'

import component from '../../src/components/FormSchemaWrappingInput.js'

/* global describe it expect */

init()

describe('component', () => {
  it('should a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const schema = {
      type: 'string',
      title: 'label value'
    }

    const vm = {
      fields: [],
      data: {},
      value: {},
      default: {},
      inputValues: {},
      changed: (e) => {},
      $emit: () => {}
    }

    loadFields(schema, vm.fields)
    initFields(vm)

    const field = vm.fields[0]

    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { vm, field }
          })
        ])
      }
    })

    const expected = '<label><span data-required-field="false">label value</span></label>'

    expect(wrapper.find('label').html()).toEqual(expected)
  })

  it('should successfully render the component with required field', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'label value'
        }
      },
      required: ['name']
    }

    const vm = {
      fields: [],
      data: {},
      value: {},
      default: {},
      inputValues: {},
      changed: (e) => {},
      $emit: () => {}
    }

    loadFields(schema, vm.fields)
    initFields(vm)

    const field = vm.fields[0]

    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { vm, field }
          })
        ])
      }
    })

    const expected = '<label><span data-required-field="true">label value</span></label>'

    expect(wrapper.find('label').html()).toEqual(expected)
  })

  it('should successfully render the component with inputWrappingClass', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'label value'
        }
      },
      required: ['name']
    }

    const vm = {
      fields: [],
      data: {},
      value: {},
      default: {},
      inputValues: {},
      changed: (e) => {},
      $emit: () => {}
    }

    loadFields(schema, vm.fields)
    initFields(vm)

    const field = vm.fields[0]
    const inputWrappingClass = 'wrapping-class'

    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: { vm, field, inputWrappingClass }
          })
        ])
      }
    })

    const expected = '<form><div class="wrapping-class"><label><span data-required-field="true">label value</span></label></div></form>'

    expect(wrapper.html()).toEqual(expected)
  })
})
