'use strict'

import { mount } from '@vue/test-utils'
import { init, components, set } from '@/lib/components'

import component from '@/components/FormSchemaInput.js'

/* global describe it expect */

init()

describe('FormSchemaInput', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const field = {}
    const input = {
      data: {
        attrs: {
          name: 'fieldName',
          type: 'text',
          value: 'Hello'
        }
      },
      element: components.text,
      native: true
    }
    const value = 'Hello'
    const wrapper = mount(component, {
      context: {
        props: { field, value, input }
      }
    })
    const expected = '<input name="fieldName" type="text" value="Hello">'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field component', () => {
    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = {
      data: {
        attrs: {
          name: field.attrs.name,
          type: 'text'
        }
      },
      element: components.text,
      native: true
    }
    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }
    const wrapper = mount(component, {
      context: {
        props: { field, value, input }
      }
    })

    const expected = '<div><input name="fieldName-0" type="text" data-fs-index="0" value="Value 1"><input name="fieldName-1" type="text" data-fs-index="1" value="Value 2"><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field component with label', () => {
    const field = {
      label: 'array label',
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = {
      data: {
        attrs: {
          name: field.attrs.name,
          type: 'text'
        }
      },
      element: components.text,
      native: true
    }
    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }
    const wrapper = mount(component, {
      context: {
        props: { field, value, input }
      }
    })

    const expected = '<label><span data-required-field=\"false\">array label</span><div><input name="fieldName-0" type="text" data-fs-index="0" value="Value 1"><input name="fieldName-1" type="text" data-fs-index="1" value="Value 2"><button type="button">Add</button></div></label>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field for custom component', () => {
    set('text', 'input', { attrs: { type: 'password' } })

    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2,
      isArrayField: true
    }
    const input = {
      data: {
        attrs: {
          type: 'password'
        }
      },
      element: components.text,
      native: true
    }
    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }
    const wrapper = mount(component, {
      context: {
        props: { field, value, input }
      }
    })

    const expected = '<div><input type="password" data-fs-index="0" name="fieldName-0" value="Value 1"><input type="password" data-fs-index="1" name="fieldName-1" value="Value 2"><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully emit the click event', () => {
    init()

    const field = {
      attrs: {
        name: 'fieldName'
      },
      itemsNum: 2,
      maxItems: 3,
      isArrayField: true
    }
    const input = {
      data: {
        attrs: {
          name: field.attrs.name,
          type: 'password'
        }
      },
      element: components.text,
      native: true
    }
    const value = {
      'fieldName-0': 'Value 1',
      'fieldName-1': 'Value 2'
    }
    const wrapper = mount(component, {
      context: {
        props: { field, value, input }
      }
    })

    const expected = '<div><input name="fieldName-0" type="text" data-fs-index="0" value="Value 1"><input name="fieldName-1" type="text" data-fs-index="1" value="Value 2"><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)

    expect(wrapper.findAll('input').length).toEqual(2)
    expect(wrapper.findAll('button').length).toEqual(1)

    wrapper.find('button').trigger('click')

    expect(wrapper.findAll('input').length).toEqual(3)
    expect(wrapper.findAll('button').length).toEqual(1)

    wrapper.find('button').trigger('click')

    expect(wrapper.findAll('input').length).toEqual(3)
    expect(wrapper.findAll('button').length).toEqual(1)
  })
})
