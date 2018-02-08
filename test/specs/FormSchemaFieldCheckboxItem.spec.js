'use strict'

import { mount } from '@vue/test-utils'
import { loadFields } from '../../src/lib/parser'
import { init, initFields } from '../../src/lib/components'

import component from '../../src/components/FormSchemaFieldCheckboxItem.js'

/* global describe beforeEach it expect */

init()

let schema, vm, field, ref, item, inputWrappingClass

describe('component', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  beforeEach(() => {
    schema = {
      type: 'string',
      title: 'choices',
      description: 'choices description',
      attrs: {
        type: 'checkbox',
        name: 'fieldName',
        value: '123'
      }
    }
    vm = {
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

    field = vm.fields[0]
    ref = field.attrs.name
    item = {
      name: 'checkbox-name',
      label: 'checkbox label',
      value: 'checkbox value'
    }
    inputWrappingClass = 'wrapper-class'
  })

  it('should successfully render the component', () => {
    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: {
              vm, item, ref, field
            }
          })
        ])
      }
    })

    const expected = '<input type="checkbox" name="checkbox-name" value="checkbox value">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with missing item.name', () => {
    delete item.name

    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: {
              vm, item, ref, field
            }
          })
        ])
      }
    })

    const expected = '<input type="checkbox" name="fieldName" value="checkbox value">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with explicit props.checked', () => {
    const checked = true
    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: {
              vm, item, ref, field, checked
            }
          })
        ])
      }
    })

    const expected = '<input type="checkbox" name="checkbox-name" value="checkbox value" checked="checked">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with array field', () => {
    schema = {
      type: 'object',
      properties: {
        ckbox: {
          type: 'array',
          anyOf: [ item ],
          default: [ item.value ]
        }
      }
    }

    vm.data = {}
    vm.fields = []
    vm.inputValues = {}

    loadFields(schema, vm.fields)
    initFields(vm)

    field = vm.fields[0]
    ref = field.attrs.name

    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: {
              vm, item, ref, field
            }
          })
        ])
      }
    })

    const expected = '<input type="checkbox" name="ckbox" value="checkbox value" checked="checked">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with wrapping class', () => {
    const wrapper = mount({
      render (createElement) {
        return createElement('form', [
          createElement(component, {
            props: {
              vm, item, ref, field, inputWrappingClass
            }
          })
        ])
      }
    })

    vm.$emit = wrapper.vm.$emit

    const expected = '<form><div class="wrapper-class"><label><span data-required-field="false">choices</span><input type="checkbox" name="checkbox-name" value="checkbox value"><small>choices description</small></label></div></form>'

    expect(wrapper.html()).toEqual(expected)
  })
})
