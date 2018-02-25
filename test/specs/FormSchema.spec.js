'use strict'

import { mount } from '@vue/test-utils'

import component from '@/components/FormSchema.js'

/* global describe it expect */

const props = {
  schema: {},
  value: {},
  action: undefined,
  autocomplete: undefined,
  enctype: 'application/x-www-form-urlencoded',
  method: 'post',
  novalidate: false
}

const data = {
  schemaLoaded: {},
  default: {},
  fields: [],
  error: null,
  data: {},
  inputValues: {}
}

const schema = {
  type: 'object',
  title: 'Subscription',
  description: 'Subscription Form',
  properties: {
    name: {
      type: 'string',
      title: 'Your name'
    }
  },
  required: ['name']
}

describe('FormSchema', () => {
  it('should not be a functional component', () => {
    expect(component.functional).toBe(undefined)
  })

  it('should have a form-schema name', () => {
    expect(component.name).toEqual('form-schema')
  })

  const wrapper = mount(component, {
    propsData: { schema: {} }
  })

  Object.keys(props).forEach((prop) => {
    it(`should have prop ${prop} with default value`, () => {
      expect(prop in wrapper.vm).toBe(true)
      expect(wrapper.vm[prop]).toEqual(props[prop])
    })
  })

  Object.keys(data).forEach((prop) => {
    it(`should have data ${prop}`, () => {
      expect(prop in wrapper.vm).toBe(true)
      expect(wrapper.vm[prop]).toEqual(data[prop])
    })
  })

  it('should successfully render the component with an empty schema', () => {
    expect(wrapper.html()).toEqual(undefined)
  })

  it('should successfully render the component', () => {
    const wrapper = mount(component, {
      propsData: { schema }
    })

    expect(wrapper.findAll('div').length).toEqual(2)

    expect(wrapper.findAll('h1').length).toEqual(1)
    expect(wrapper.find('h1').html()).toEqual(`<h1>${schema.title}</h1>`)

    expect(wrapper.findAll('p').length).toEqual(1)
    expect(wrapper.find('p').html()).toEqual(`<p>${schema.description}</p>`)

    expect(wrapper.findAll('form').length).toEqual(1)

    expect(wrapper.find('form').element.hasAttribute('enctype')).toBe(true)
    expect(wrapper.find('form').element.getAttribute('enctype')).toEqual(props.enctype)

    expect(wrapper.find('form').element.hasAttribute('method')).toBe(true)
    expect(wrapper.find('form').element.getAttribute('method')).toEqual(props.method)

    expect(wrapper.findAll('label').length).toEqual(1)

    expect(wrapper.findAll('span').length).toEqual(1)
    expect(wrapper.find('span').html()).toEqual('<span data-required-field="true">Your name</span>')

    expect(wrapper.findAll('input').length).toEqual(1)
    expect(wrapper.find('input').html()).toEqual('<input type="text" value="" required="required" name="name">')

    expect(wrapper.findAll('button').length).toEqual(1)
    expect(wrapper.find('button').html()).toEqual('<button type="submit">Submit</button>')
  })

  it('should successfully emit events', () => {
    const wrapper = mount(component, {
      propsData: { schema }
    })

    const input = wrapper.find('input')
    const expected = {
      name: 'Sébastien'
    }

    expect(wrapper.vm.data).toEqual({ name: '' })

    input.element.value = 'Sébastien'
    input.trigger('input')

    expect('input' in wrapper.emitted()).toBe(true)
    expect(wrapper.emitted().input[0][0]).toEqual(expected)
    expect(wrapper.vm.data).toEqual(expected)
  })

  it('vm.form()', () => {
    const wrapper = mount(component, {
      propsData: { schema }
    })

    expect(wrapper.vm.form().tagName).toEqual('FORM')
  })

  it('vm.reportValidity()', () => {
    const wrapper = mount(component, {
      propsData: { schema }
    })

    const input = wrapper.find('input')

    input.element.value = 'Sébastien'

    expect(wrapper.vm.reportValidity()).toBe(true)
    expect(wrapper.vm.checkValidity()).toBe(true)
  })

  it('vm.reset()', () => {
    const wrapper = mount(component, {
      propsData: { schema }
    })

    const input = wrapper.find('input')

    input.element.value = 'Sébastien'
    input.trigger('input')

    expect(wrapper.vm.data).toEqual({ name: 'Sébastien' })

    wrapper.vm.reset()

    expect(wrapper.vm.data).toEqual({ name: '' })
  })

  it('vm.setErrorMessage(message) & vm.clearErrorMessage()', () => {
    const wrapper = mount(component, {
      propsData: { schema }
    })

    wrapper.vm.setErrorMessage('error message')
    wrapper.update()

    expect(wrapper.vm.error).toEqual('error message')
    expect(wrapper.findAll('div').length).toEqual(3)
    expect(wrapper.findAll('div').at(1).html()).toEqual('<div>error message</div>')

    wrapper.vm.clearErrorMessage()
    wrapper.update()

    expect(wrapper.vm.error).toEqual(null)
    expect(wrapper.findAll('div').length).toEqual(2)
  })
})
