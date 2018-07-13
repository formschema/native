import { INPUT_TYPES } from './parser'

const BLOCK_TYPES = [INPUT_TYPES.TEXTAREA, INPUT_TYPES.SELECT]

const Input = {
  functional: true,
  render (h, { data, slots }) {
    const field = data.field
    const element = BLOCK_TYPES.includes(field.attrs.type)
      ? h(field.attrs.type, data, slots().default)
      : h('input', data)
    const nodes = [ element ]

    if (field.description) {
      nodes.push(h('small', field.description))
    }

    if (!field.label || (field.isArrayField && !BLOCK_TYPES.includes(field.attrs.type))) {
      if (nodes.length === 1) {
        return nodes[0]
      }
      return nodes
    }

    return h(Label, data, nodes)
  }
}

const CheckboxGroup = {
  functional: true,
  render (h, { data, slots }) {
    const name = data.field.attrs.name
    const description = data.field.description

    const children = [ ...slots().default ]

    if (description) {
      children.unshift(h('legend', description))

      delete data.field.description
    }

    return h('fieldset', { attrs: { name } }, children)
  }
}

const ArrayInputs = {
  functional: true,
  render (h, { slots }) {
    return h('div', {
      attrs: {
        'data-fs-array-inputs': true
      }
    }, slots().default)
  }
}

const Label = {
  functional: true,
  render (h, { data, slots }) {
    const field = data.field
    const attrs = {
      'data-fs-field': field.attrs.id,
      'data-fs-required': field.attrs.required
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
      }, slots().default)
    ])
  }
}

const Fieldset = {
  functional: true,
  render (h, { data, slots }) {
    const field = data.field
    const newItemButton = data.newItemButton
    const nodes = []

    if (field.isArrayField) {
      if (newItemButton) {
        nodes.push(h(ArrayInputs, slots().default))
        nodes.push(h(ArrayButton, newItemButton))
      } else {
        nodes.push(h(CheckboxGroup, data, slots().default))
      }
    } else {
      nodes.push(h('fieldset', slots().default))
    }

    if (field.description) {
      nodes.push(h('small', field.description))
    }

    if (!field.label) {
      if (nodes.length === 1) {
        return nodes[0]
      }
      return nodes
    }

    return h(Label, data, nodes)
  }
}

const ArrayButton = {
  functional: true,
  render (h, { data }) {
    return h('button', {
      attrs: { type: 'button', ...data.props },
      on: data.on
    }, 'Add')
  }
}

const ErrorElement = {
  functional: true,
  render (h, { slots }) {
    return h('div', {
      attrs: {
        'data-fs-error': true
      }
    }, slots().default)
  }
}

const TAGS = {
  title: 'h1',
  description: 'p',
  formwrapper: 'div',
  form: 'form',
  text: Input,
  option: 'option',
  fieldset: Fieldset,
  error: ErrorElement
}

export class Components {
  constructor () {
    this.$ = {}

    for (let type in TAGS) {
      this.set(type, TAGS[type], true)
    }
  }

  set (type, component, native = false) {
    this.$[type] = { type, native, component }
  }

  input ({ field, fieldParent = null, listeners = {} }) {
    const { type } = field.attrs
    const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(type)
      ? this.$.fieldset
      : this.$[type] || this.$[INPUT_TYPES.TEXT]

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
}

export function argName (el) {
  return el.native ? 'attrs' : 'props'
}

export const groupedArrayTypes = [
  INPUT_TYPES.RADIO, INPUT_TYPES.CHECKBOX, 'input', INPUT_TYPES.TEXTAREA
]

export const fieldTypesAsNotArray = [
  INPUT_TYPES.RADIO, INPUT_TYPES.TEXTAREA, INPUT_TYPES.SELECT
]

export const inputName = (field, index) => `${field.attrs.name}-${index}`
