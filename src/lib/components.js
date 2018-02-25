'use strict'

import { equals, merge } from './object'

const tags = {
  h1: ['title'],
  p: ['description'],
  div: [
    'error', 'textgroup', 'buttonswrapper', 'formwrapper',
    'inputswrapper', 'inputwrapper', 'defaultGroup'
  ],
  legend: ['legend'],
  fieldset: ['radiogroup', 'checkboxgroup'],
  small: ['inputdesc'],
  form: ['form'],
  input: {
    typed: [
      'checkbox', 'color', 'date', 'datetime', 'datetime-local',
      'email', 'file', 'hidden', 'image', 'month', 'number',
      'password', 'radio', 'range', 'search', 'tel', 'text',
      'time', 'url', 'week'
    ]
  },
  textarea: ['textarea'],
  select: ['select'],
  option: ['option'],
  label: ['label'],
  button: ['submitbutton', 'arraybutton']
}

export const components = {}

export function renderFieldset (createElement, { data, props, slots }) {
  const children = [
    createElement(components.inputswrapper.component, slots().default)
  ]

  if (data.$field.description) {
    children.unshift(createElement(
      components.legend.component, {
        //         [argName(components.legend)]: legend
      }, data.$field.description))
  }

  return createElement('fieldset', {
    attrs: {
      name: data.$field.attrs.name
    }
  }, children)
}

export function renderLabel (createElement, { data, props, slots }) {
  const nodes = slots().default || []
  const field = props.field || data.$field

  if (!field.label) {
    return nodes.length === 1 ? nodes[0] : nodes
  }

  nodes.unshift(createElement('span', {
    attrs: {
      'data-required-field': field.attrs.required ? 'true' : 'false'
    }
  }, field.label))

  return createElement('label', nodes)
}

export const renderButton = (type, label) => (createElement, { data }) => {
  if (!data.attrs) {
    data.attrs = {}
  }

  data.attrs.type = type

  return createElement('button', data, label)
}

export function set (type, component, option = null, native = false) {
  components[type] = {
    type,
    native,
    tagName: component,
    component: typeof component === 'string' ? {
      functional: true,
      render (createElement, { data, slots }) {
        const nodes = slots().default || []

        merge(data, option)

        if (nodes.length === 0 && Object.keys(data).length === 0) {
          return null
        }

        return createElement(component, data, nodes)
      }
    } : component
  }
}

export function init () {
  for (let component in tags) {
    delete components[component]

    if (tags[component] instanceof Array) {
      tags[component].forEach((name) => set(name, component, {}, true))
    } else {
      tags[component].typed.forEach((type) => {
        set(type, component, { attrs: { type } }, true)
      })
    }
  }

  components.radiogroup.component.render = renderFieldset
  components.checkboxgroup.component.render = renderFieldset
  components.inputwrapper.component.render = renderLabel
  components.submitbutton.component.render = renderButton('submit', 'Submit')
  components.arraybutton.component.render = renderButton('button', 'Add')
}

export function argName (el) {
  return el.native ? 'attrs' : 'props'
}

export const groupedArrayTypes = [
  'radio', 'checkbox', 'input', 'textarea'
]

export function input ({ vm, field, ref }) {
  const attrs = field.attrs

  if (!attrs.hasOwnProperty('value')) {
    attrs.value = vm.data[attrs.name]
  }

  const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(attrs.type)
    ? components[`${attrs.type}group`] || components.defaultGroup
    : components[attrs.type] || components.text

  return {
    ref,
    element: element,
    data: {
      $field: field,
      props: {},
      domProps: {},
      [argName(element)]: attrs,
      on: {
        input (event) {
          vm.data[attrs.name] = event && event.target
            ? event.target.value
            : event

          /**
           * Fired synchronously when the value of an element is changed.
           */
          vm.$emit('input', vm.data)
        },
        change: vm.changed
      }
    }
  }
}

export const fieldTypesAsNotArray = [
  'radio', 'textarea', 'select'
]

export const inputName = (field, index) => `${field.attrs.name}-${index}`

export function initFields (vm) {
  vm.fields.forEach((field) => {
    const attrs = field.attrs

    vm.data[attrs.name] = vm.value[attrs.name] || attrs.value

    if (!fieldTypesAsNotArray.includes(attrs.type) && field.schemaType === 'array') {
      field.isArrayField = true

      if (!Array.isArray(vm.data[attrs.name])) {
        vm.data[attrs.name] = []
      }

      vm.data[attrs.name] = vm.data[attrs.name].filter((value, i) => {
        vm.inputValues[inputName(field, i)] = value
        return value !== undefined
      })

      field.itemsNum = attrs.type === 'checkbox'
        ? field.items.length
        : field.minItems
    }
  })

  vm.data = Object.seal(vm.data)

  if (!equals(vm.data, vm.value)) {
    /**
     * @private
     */
    vm.$emit('input', vm.data)
  }

  Object.keys(vm.data).forEach((key) => {
    vm.default[key] = typeof vm.data[key] === 'object' && vm.data[key] !== null
      ? Object.freeze(vm.data[key])
      : vm.data[key]
  })
}
