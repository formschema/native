const TAGS = {
  h1: ['title'],
  p: ['description'],
  div: [ 'formwrapper', 'defaultGroup' ],
  form: ['form'],
  input: [
    'checkbox', 'color', 'date', 'datetime', 'datetime-local',
    'email', 'file', 'hidden', 'image', 'month', 'number',
    'password', 'radio', 'range', 'search', 'tel', 'text',
    'time', 'url', 'week'
  ],
  option: ['option']
}

const BLOCK_INPUTS = ['textarea', 'select']

const Input = {
  functional: true,
  render (h, { data, slots }) {
    const field = data.field
    const element = BLOCK_INPUTS.includes(field.attrs.type)
      ? h(field.attrs.type, data, slots().default)
      : h('input', data)
    const nodes = [ element ]

    if (field.description) {
      nodes.push(h('small', field.description))
    }

    if (!field.label || (field.isArrayField && !BLOCK_INPUTS.includes(field.attrs.type))) {
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

export class Components {
  constructor () {
    this.$ = {}

    for (let component in TAGS) {
      TAGS[component].forEach((name) => this.set(name, component, true))
    }

    this.set('fieldset', Fieldset, true)
    this.set('textarea', Input, true)
    this.set('select', Input, true)
    this.set('radiogroup', Fieldset, true)
    this.set('checkboxgroup', Fieldset, true)
    this.set('error', ErrorElement, true)
  }

  set (type, component, native = false) {
    this.$[type] = {
      type,
      native,
      component: component === 'input'
        ? Input
        : component
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
