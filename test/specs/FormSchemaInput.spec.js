

import sinon from 'sinon'

import { mount } from '@vue/test-utils'
import { Components } from '@/lib/components'

import component, { INPUT_ADDED_EVENT } from '@/components/FormSchemaInput'

/* global describe it expect */

const components = new Components()

describe('FormSchemaInput', () => {
  it('should be a functional component', () => {
    expect(component.functional).toBe(true)
  })

  it('should successfully render the component', () => {
    const field = {
      attrs: {
        id: 'x',
        type: 'text',
        name: 'fieldName',
        value: 'Hello'
      }
    }
    const input = components.input({ field })
    const value = 'Hello'

    const wrapper = mount({
      render (h) {
        return h('div', [
          h(component, {
            input,
            field,
            components,
            props: { value }
          })
        ])
      }
    })

    const expected = '<div><input id="x" type="text" name="fieldName" value="Hello"></div>'

    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field component', () => {
    const field = {
      attrs: {
        id: 'x',
        name: 'fieldName',
        type: 'text'
      },
      itemsNum: 2,
      isArrayField: true,
      path: [ 'fieldName' ]
    }
    const input = components.input({ field })
    const value = [ 'Value 1', 'Value 2' ]


    const wrapper = mount({
      render (h) {
        return h('div', [
          h(component, {
            input,
            field,
            components,
            props: { value }
          })
        ])
      }
    })

    const expected = '<div><div data-fs-array-inputs="true"><div data-fs-array-input="true"><input id="x" name="fieldName" type="text" data-fs-index="0" value="Value 1" data-fs-array-value="Value 1,Value 2"><button type="button">Remove</button></div><div data-fs-array-input="true"><input id="x-1" name="fieldName" type="text" data-fs-index="1" value="Value 2" data-fs-array-value="Value 1,Value 2"><button type="button">Remove</button></div></div><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field component with label', () => {
    const field = {
      label: 'array label',
      labelAttrs: {
        id: 'x-label',
        for: 'x'
      },
      attrs: {
        id: 'x',
        name: 'fieldName',
        type: 'text'
      },
      itemsNum: 2,
      isArrayField: true,
      path: [ 'fieldName' ]
    }
    const input = components.input({ field })
    const value = [ 'Value 1', 'Value 2' ]

    const wrapper = mount({
      render (h) {
        return h('div', [
          h(component, {
            input,
            field,
            components,
            props: { value }
          })
        ])
      }
    })

    const expected = '<div><div data-fs-field="x"><label id="x-label" for="x">array label</label><div data-fs-field-input="x"><div data-fs-array-inputs="true"><div data-fs-array-input="true"><input id="x" name="fieldName" type="text" data-fs-index="0" value="Value 1" data-fs-array-value="Value 1,Value 2"><button type="button">Remove</button></div><div data-fs-array-input="true"><input id="x-1" name="fieldName" type="text" data-fs-index="1" value="Value 2" data-fs-array-value="Value 1,Value 2"><button type="button">Remove</button></div></div><button type="button">Add</button></div></div></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully render a array field for custom component', () => {
    components.set('text', 'input', { attrs: { type: 'password' } })

    const field = {
      attrs: {
        id: 'x',
        type: 'password',
        name: 'fieldName',
      },
      itemsNum: 2,
      isArrayField: true,
      path: [ 'fieldName' ]
    }
    const input = components.input({ field })
    const value = [ 'Value 1', 'Value 2' ]

    const wrapper = mount({
      render (h) {
        return h('div', [
          h(component, {
            input,
            field,
            components,
            props: { value }
          })
        ])
      }
    })

    const expected = '<div><div data-fs-array-inputs="true"><input id="x" type="password" name="fieldName" data-fs-index="0" value="Value 1" data-fs-array-value="Value 1,Value 2"><input id="x-1" type="password" name="fieldName" data-fs-index="1" value="Value 2" data-fs-array-value="Value 1,Value 2"></div><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)
  })

  it('should successfully emit the click event', () => {
    const field = {
      attrs: {
        id: 'x',
        type: 'password',
        name: 'fieldName',
      },
      itemsNum: 2,
      maxItems: 3,
      isArrayField: true,
      path: [ 'fieldName' ]
    }
    const input = components.input({ field })

    const value = [ 'Value 1', 'Value 2' ]

    const listeners = {
      [INPUT_ADDED_EVENT]: sinon.spy()
    }

    const wrapper = mount({
      render (h) {
        return h('div', [
          h(component, {
            input,
            field,
            components,
            props: { value },
            on: listeners
          })
        ])
      }
    })

    const expected = '<div><div data-fs-array-inputs="true"><input id="x" type="password" name="fieldName" data-fs-index="0" value="Value 1" data-fs-array-value="Value 1,Value 2"><input id="x-1" type="password" name="fieldName" data-fs-index="1" value="Value 2" data-fs-array-value="Value 1,Value 2"></div><button type="button">Add</button></div>'

    expect(wrapper.html()).toEqual(expected)

    expect(wrapper.findAll('input').length).toEqual(2)
    expect(wrapper.findAll('button').length).toEqual(1)

    wrapper.find('button').trigger('click')

    expect(listeners[INPUT_ADDED_EVENT].calledOnce).toBe(true)
  })
})
