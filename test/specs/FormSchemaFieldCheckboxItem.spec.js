'use strict'

import { mount } from '@vue/test-utils'
import { loadFields } from '@/lib/parser'
import { init, initFields } from '@/lib/components'

import component from '@/components/FormSchemaFieldCheckboxItem.js'

/* global describe beforeEach it expect */

init()

let schema, vm, field, item

describe('FormSchemaFieldCheckboxItem', () => {
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
    item = {
      name: 'checkbox-name',
      label: 'checkbox label',
      value: 'checkbox value'
    }
  })

  it('should successfully render the component', () => {
    const wrapper = mount(component, {
      context: {
        props: {
          vm, item, field
        }
      }
    })

    const expectedInput = '<input name="checkbox-name" type="checkbox" value="checkbox value">'
    const expectedLabelInput = '<label><span data-required-field="false">checkbox label</span><input name="checkbox-name" type="checkbox" value="checkbox value"><small>choices description</small></label>'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.find('input').html()).toEqual(expectedInput)
    expect(wrapper.find('label').html()).toEqual(expectedLabelInput)
  })

  it('should successfully render the component with missing item.name', () => {
    delete item.name

    const wrapper = mount(component, {
      context: {
        props: {
          vm, item, field
        }
      }
    })

    const expected = '<input name="fieldName" type="checkbox" value="checkbox value">'

    expect(wrapper.find('input').html()).toEqual(expected)
  })

  it('should successfully render the component with explicit props.checked', () => {
    const checked = true
    const wrapper = mount(component, {
      context: {
        props: {
          vm, item, field, checked
        }
      }
    })

    const expected = '<input name="checkbox-name" type="checkbox" value="checkbox value" checked="checked">'

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

    const wrapper = mount(component, {
      context: {
        props: {
          vm, item, field
        }
      }
    })

    const expected = '<label><span data-required-field="false">checkbox label</span><input name="checkbox-name" type="checkbox" value="checkbox value" checked="checked"></label>'

    expect(wrapper.html()).toEqual(expected)
  })
})
