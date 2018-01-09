'use strict'

const tags = {
  h1: ['title'],
  p: ['description'],
  div: ['error', 'textgroup', 'radiogroup', 'checkboxgroup', 'defaultGroup'],
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

export const groupedArrayTypes = ['radio', 'checkbox', 'input', 'textarea']

export function input ({ vm, field, ref }) {
  const attrs = field.attrs

  if (!attrs.value) {
    attrs.value = vm.data[attrs.name]
  }

  const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(attrs.type)
    ? components[`${attrs.type}group`] || components.defaultGroup
    : components[attrs.type] || components.text

  const fieldOptions = elementOptions(vm, element, attrs, field)

  return {
    ref: ref || attrs.name,
    domProps: {
      value: vm.data[attrs.name]
    },
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
