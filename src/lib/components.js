'use strict'

import _ from 'lodash'
import { equals } from './object'

const tags = {
  h1: ['title'],
  p: ['description'],
  div: ['error', 'textgroup', 'inputswrapper', 'defaultGroup'],
  legend: ['legend'],
  fieldset: ['radiogroup', 'checkboxgroup'],
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
  button: [
    { component: 'button', option: { type: 'submit', label: 'Submit' } },
    { component: 'arraybutton', option: { type: 'button', label: 'Add' } }
  ]
}

export const option = { native: true }
export const components = {}

export const defineComponent = (tag, item) => {
  if (typeof item === 'object') {
    components[item.component] = {
      component: tag,
      option: { ...option, ...item.option }
    }
  } else {
    components[item] = {
      component: tag,
      option
    }
  }
}

export function renderFieldset (createElement, { props, slots }) {
  const inputswrapper = components.inputswrapper
  const vm = {}

  const inputswrapperOptions = elementOptions(vm, inputswrapper)
  const children = [
    createElement(
      inputswrapper.component, inputswrapperOptions, slots().default)
  ]

  if (props.field.description) {
    const legend = components.legend
    const legendOptions = elementOptions(vm, legend)

    children.unshift(createElement(
      legend.component, legendOptions, props.field.description))
  }

  return createElement('fieldset', {
    attrs: {
      name: props.field.attrs.name
    }
  }, children)
}

export function init () {
  for (let tag in tags) {
    if (tags[tag] instanceof Array) {
      tags[tag].forEach((item) => defineComponent(tag, item))
    } else {
      tags[tag].typed.forEach((type) => {
        defineComponent(tag, { component: type, option: { type } })
      })
    }
  }

  components.radiogroup.render = renderFieldset
  components.checkboxgroup.render = renderFieldset
}

export function set (type, component, option = {}) {
  const defaultOption = components[type]
    ? { ...components[type].option }
    : {}

  delete defaultOption.native

  components[type] = { type, component, option, defaultOption }
}

export function elementOptions (vm, el, extendingOptions = {}, field = { attrs: {} }, item = {}) {
  const attrName = el.option.native ? 'attrs' : 'props'
  const elProps = typeof el.option === 'function'
    ? { ...extendingOptions, ...el.option({ vm, field, item }) }
    : { ...el.option, native: undefined, ...extendingOptions }

  return {
    [attrName]: {
      ...el.defaultOption,
      ...elProps
    }
  }
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

  const fieldOptions = elementOptions(vm, element, attrs, field)

  return {
    ref: ref || attrs.name,
    element: element,
    domProps: {},
    on: {
      input: (event) => {
        vm.data[attrs.name] = event && event.target
          ? event.target.value
          : event

        /**
         * Fired synchronously when the value of an element is changed.
         */
        vm.$emit('input', vm.data)
      },
      change: vm.changed
    },
    ...fieldOptions
  }
}

export const fieldTypesAsNotArray = [
  'radio', 'textarea', 'select'
]

export const inputName = (field, index) => `${field.attrs.name}-${index}`

export const initObjectAttribute = (object, attrName) => {
  // inits the data store obj
  if (!object.__data) {
    Object.defineProperty(object, '__data', {
      value: {},
      enumerable: false
    })
    // object.__data = {}
  }
  // inits the data value
  _.set(object.__data, attrName, _.get(object, attrName))

  // allows object dot notation getter/setter
  // eg. alert(o['sub.key'])
  //     o['sub.key'] = value
  Object.defineProperty(object, attrName, {
    set: (value) => {
      return _.set(object.__data, attrName, value)
    },
    get: () => {
      return _.get(object.__data, attrName)
    },
    enumerable: true
  })
}

export function initFields (vm) {
  vm.fields.forEach((field) => {
    const attrs = field.attrs

    // defines the vm data setter and getter
    initObjectAttribute(vm.data, attrs.name)
    initObjectAttribute(vm.default, attrs.name)

    vm.data[attrs.name] = _.get(vm.value, attrs.name) || attrs.value

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

  // vm.data = Object.seal(vm.data)

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
