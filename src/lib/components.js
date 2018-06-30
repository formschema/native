'use strict'

import { merge } from './object'

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

export function renderFieldset (h, { data, props, slots }) {
  const name = data.field.attrs.name
  const description = data.field.description

  const children = [
    h(components.inputswrapper.component, slots().default)
  ]

  if (description) {
    children.unshift(h(components.legend.component, description))

    delete data.field.description
  }

  return h('fieldset', { attrs: { name } }, children)
}

export function renderInput (h, { data, props, slots }) {
  const nodes = slots().default || []
  const field = props.field
  const attrs = {
    'data-fs-field': props.field.attrs.id,
    'data-fs-required': field.attrs.required
  }

  if (field.description) {
    nodes.push(h(components.inputdesc.component, {
      props: { field }
    }, field.description))
  }

  if (!field.label) {
    if (nodes.length > 1) {
      return h('div', { attrs }, nodes)
    }

    return nodes[0]
  }

  return h('div', { attrs }, [
    h('label', {
      attrs: {
        for: props.field.attrs.id
      }
    }, field.label),
    h('div', {
      attrs: {
        'data-fs-field-input': props.field.attrs.id
      }
    }, nodes)
  ])
}

export function renderButtons (h, { slots }) {
  return h('div', {
    attrs: {
      'data-fs-buttons': true
    }
  }, slots().default)
}

export function renderError (h, { slots }) {
  return h('div', {
    attrs: {
      'data-fs-error': true
    }
  }, slots().default)
}

export const renderButton = (type, label) => (h, { data }) => {
  return h('button', {
    attrs: { type, ...data.attrs },
    on: data.on
  }, label)
}

export function set (type, component, option = null, native = false) {
  if (typeof component !== 'string') {
    component.functional = true
  }

  components[type] = {
    type,
    native,
    component: typeof component === 'string' ? {
      functional: true,
      render (h, { data, slots }) {
        const nodes = slots().default || []

        if (option) {
          merge(data, option)
        }

        if (nodes.length === 0 && Object.keys(data).length === 0) {
          return null
        }

        return h(component, data, nodes)
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
  components.inputwrapper.component.render = renderInput
  components.buttonswrapper.component.render = renderButtons
  components.error.component.render = renderError
  components.submitbutton.component.render = renderButton('submit', 'Submit')
  components.arraybutton.component.render = renderButton('button', 'Add')
}

export function argName (el) {
  return el.native ? 'attrs' : 'props'
}

export const groupedArrayTypes = [
  'radio', 'checkbox', 'input', 'textarea'
]

export function input ({ field, fieldParent = null, listeners = {} }) {
  const { type } = field.attrs
  const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(type)
    ? components[`${type}group`] || components.defaultGroup
    : components[type] || components.text

  const data = {
    field,
    fieldParent,
    attrs: {},
    props: {},
    domProps: {},
    [argName(element)]: { ...field.attrs },
    on: listeners
  }

  return { element, data }
}

export const fieldTypesAsNotArray = [
  'radio', 'textarea', 'select'
]

export const inputName = (field, index) => `${field.attrs.name}-${index}`
