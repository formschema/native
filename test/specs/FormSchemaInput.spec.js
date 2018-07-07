'use strict'

import sinon from 'sinon'

import { mount } from '@vue/test-utils'
import { Components } from '@/lib/components'

import {
  INPUT_ADDED_EVENT,
  default as component
} from '@/components/FormSchemaInput.js'

/* global describe it expect */

const components = new Components()

describe('FormSchemaInput', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const field = {
      attrs: {
        type: 'text',
        name: 'fieldName',
        value: 'Hello'
      }
    }
    const input = components.input({ field })
    const value = 'Hello'
    const wrapper = mount(component, {
      context: {
        input,
        field,
        components,
        props: { value }
      }
    })
    const expected = '<input type="text" name="fieldName" value="Hello">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field component', () => {
    const field = {
      attrs: {
        name: 'fieldName',
        type: 'text'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = components.input({ field })
    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }
    const wrapper = mount(component, {
      context: {
        input,
        field,
        components,
        props: { value }
      }
    })

    const expected = '<div><input name="fieldName-0" type="text" data-fs-index="0" value="Value 1"><input name="fieldName-1" type="text" data-fs-index="1" value="Value 2"><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field component with label', () => {
    const field = {
      label: 'array label',
      attrs: {
        name: 'fieldName',
        type: 'text'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = components.input({ field })
    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }
    const wrapper = mount(component, {
      context: {
        input,
        field,
        components,
        props: { value }
      }
    })

    const expected = '<div><div><label>array label</label><div><input name="fieldName-0" type="text" data-fs-index="0" value="Value 1"><input name="fieldName-1" type="text" data-fs-index="1" value="Value 2"></div></div><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field for custom component', () => {
    components.set('text', 'input', { attrs: { type: 'password' } })

    const field = {
      attrs: {
        type: 'password',
        name: 'fieldName'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = components.input({ field })
    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }
    const wrapper = mount(component, {
      context: {
        input,
        field,
        components,
        props: { value }
      }
    })

    const expected = '<div><input type="password" name="fieldName-0" data-fs-index="0" value="Value 1"><input type="password" name="fieldName-1" data-fs-index="1" value="Value 2"><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully emit the click event', () => {
    const field = {
      attrs: {
        type: 'password',
        name: 'fieldName'
      },
      itemsNum: 2,
      maxItems: 3,
      isArrayField: true
    }
    const input = components.input({ field })

    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }

    const listeners = {
      [INPUT_ADDED_EVENT]: sinon.spy()
    }

    const wrapper = mount(component, {
      context: {
        input,
        field,
        components,
        props: { value },
        on: listeners
      }
    })

    const expected = '<div><input type="password" name="fieldName-0" data-fs-index="0" value="Value 1"><input type="password" name="fieldName-1" data-fs-index="1" value="Value 2"><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)

    expect(wrapper.findAll('input').length).toEqual(2)
    expect(wrapper.findAll('button').length).toEqual(1)

    wrapper.find('button').trigger('click')

    expect(listeners[INPUT_ADDED_EVENT].calledOnce).toBe(true)

//     expect(wrapper.findAll('input').length).toEqual(3)
//     expect(wrapper.findAll('button').length).toEqual(1)
//
//     wrapper.find('button').trigger('click')
//
//     expect(wrapper.findAll('input').length).toEqual(3)
//     expect(wrapper.findAll('button').length).toEqual(1)
  })
})
