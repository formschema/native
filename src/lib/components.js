import { merge } from './object'

const tags = {
  h1: ['title'],
  p: ['description'],
  div: [
    'error', 'textgroup', 'buttonswrapper', 'formwrapper', 'inputswrapper',
    'inputwrapper', 'defaultGroup', 'arrayInputs'
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
  button: ['arraybutton']
}

export class Components {
  constructor () {
    this.$ = {}

    for (let component in tags) {
      if (tags[component] instanceof Array) {
        tags[component].forEach((name) => this.set(name, component, {}, true))
      } else {
        tags[component].typed.forEach((type) => {
          this.set(type, component, { attrs: { type } }, true)
        })
      }
    }

    this.$.radiogroup.component.render = (...args) => this.renderFieldset(...args)
    this.$.checkboxgroup.component.render = (...args) => this.renderFieldset(...args)
    this.$.inputwrapper.component.render = (...args) => this.renderInput(...args)
    this.$.arrayInputs.component.render = (...args) => this.arrayInputs(...args)
    this.$.arraybutton.component.render = (...args) => this.renderArrayButton(...args)
    this.$.buttonswrapper.component.render = (...args) => this.renderButtons(...args)
    this.$.error.component.render = (...args) => this.renderError(...args)
  }

  set (type, component, option = null, native = false) {
    if (typeof component !== 'string') {
      component.functional = true
    }

    this.$[type] = {
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

  input ({ field, fieldParent = null, listeners = {} }) {
    const { type } = field.attrs
    const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(type)
      ? this.$[`${type}group`] || this.$.defaultGroup
      : this.$[type] || this.$.text

    const data = {
      field,
      fieldParent,
      components: this.components,
      attrs: {},
      props: {},
      domProps: {},
      [argName(element)]: { ...field.attrs },
      on: listeners
    }

    return { element, data }
  }

  renderFieldset (h, { data, slots }) {
    const name = data.field.attrs.name
    const description = data.field.description

    const children = [
      h(this.$.inputswrapper.component, slots().default)
    ]

    if (description) {
      children.unshift(h(this.$.legend.component, description))

      delete data.field.description
    }

    return h('fieldset', { attrs: { name } }, children)
  }

  renderInput (h, { data, slots }) {
    const nodes = slots().default || []
    const field = data.field
    const attrs = {
      'data-fs-field': field.attrs.id,
      'data-fs-required': field.attrs.required
    }

    if (field.description) {
      nodes.push(h(this.$.inputdesc.component, {
        field
      }, field.description))
    }

    if (!field.label) {
      if (nodes.length > 1) {
        return nodes
      }

      return nodes[0]
    }

    return h('div', { attrs }, [
      h('label', {
        attrs: {
          for: field.attrs.id
        }
      }, field.label),
      h('div', {
        attrs: {
          'data-fs-field-input': field.attrs.id
        }
      }, nodes)
    ])
  }

  arrayInputs (h, { slots }) {
    return h('div', {
      attrs: {
        'data-fs-array-inputs': true
      }
    }, slots().default)
  }

  renderButtons (h, { slots }) {
    return h('div', {
      attrs: {
        'data-fs-buttons': true
      }
    }, slots().default)
  }

  renderError (h, { slots }) {
    return h('div', {
      attrs: {
        'data-fs-error': true
      }
    }, slots().default)
  }

  renderArrayButton (h, { data }) {
    return h('button', {
      attrs: { type: 'button', ...data.attrs },
      on: data.on
    }, 'Add')
  }
}

export function argName (el) {
  return el.native ? 'attrs' : 'props'
}

export const groupedArrayTypes = [
  'radio', 'checkbox', 'input', 'textarea'
]

export const fieldTypesAsNotArray = [
  'radio', 'textarea', 'select'
]

export const inputName = (field, index) => `${field.attrs.name}-${index}`
