import { INPUT_TYPES } from './parser'

const BLOCK_TYPES = [ INPUT_TYPES.TEXTAREA, INPUT_TYPES.SELECT ]
const LABELED_ARRAY_TYPES = [ INPUT_TYPES.CHECKBOX ]

export const groupedArrayTypes = [
  INPUT_TYPES.RADIO, INPUT_TYPES.CHECKBOX, 'input', INPUT_TYPES.TEXTAREA
]

export const fieldTypesAsNotArray = [
  INPUT_TYPES.RADIO, INPUT_TYPES.TEXTAREA, INPUT_TYPES.SELECT
]

export const inputName = (field, index) => `${field.attrs.name}-${index}`

function getEventData (element, event) {
  const { field } = element.data
  let { value } = event.target

  if (field.attrs.type === INPUT_TYPES.CHECKBOX) {
    if (field.isArrayField) {
      ({ value } = element.data.props)

      const index = value.indexOf(event.target.value)

      if (event.target.checked) {
        if (index === -1) {
          value.push(event.target.value)
        }
      } else if (index > -1) {
        value.splice(index, 1)
      }
    } else {
      value = event.target.checked
    }
  } else if (field.attrs.type === INPUT_TYPES.RADIO) {
    if (event.target.checked) {
      ({ value } = field.attrs)
    }
  } else if (field.isArrayField) {
    ({ value } = element.data.props)
    const index = element.data.attrs['data-fs-index']

    value = value.slice(0)
    value[index] = event.target.value

    for (let i = 0; i < value.length; i++) {
      value[i] = value[i] !== undefined ? value[i] : ''
    }
  }

  return { field, value }
}

const Label = {
  functional: true,
  render (h, { data, slots }) {
    const { field } = data
    const attrs = {
      'data-fs-field': field.attrs.id,
      'data-fs-required': field.attrs.required
    }

    if (field.attrs.type === INPUT_TYPES.OBJECT) {
      attrs['data-fs-object-field'] = true
    }

    const inputLabel = h('label', {
      attrs: field.labelAttrs
    }, field.label)

    const inputField = h('div', {
      attrs: {
        'data-fs-field-input': field.attrs.id
      }
    }, slots().default || [])

    return h('div', { attrs }, [ inputLabel, inputField ])
  }
}

const ArrayInput = {
  functional: true,
  render (h, { data, slots, listeners }) {
    const { field, fieldParent, props, attrs } = data
    const { value } = props
    const removeButton = h('button', {
      attrs: { type: 'button' },
      on: {
        click () {
          fieldParent.itemsNum--
          const index = attrs['data-fs-index']
          value.splice(index, 1)
          listeners.input({ field, value })
        }
      }
    }, 'Remove')

    return h('div', {
      attrs: {
        'data-fs-array-input': true
      }
    }, [ ...slots().default, removeButton ])
  }
}

const Input = {
  functional: true,
  render (h, { data, slots }) {
    const { field, on: listeners } = data
    const componentName = BLOCK_TYPES.includes(field.attrs.type)
      ? field.attrs.type
      : 'input'
    const element = h(componentName,
      { ...data,
        on: {
          ...data.on,
          input (event) {
            listeners.input(getEventData(element, event))
          },
          change (event) {
            listeners.change(getEventData(element, event))
          }
        }
      }, slots().default)
    const nodes = [ element ]

    if (field.description) {
      nodes.push(h('small', {
        attrs: field.descAttrs
      }, field.description))
    }

    if (field.isArrayField
        && !BLOCK_TYPES.includes(field.attrs.type)
        && !LABELED_ARRAY_TYPES.includes(field.attrs.type)) {
      return h(ArrayInput, data, nodes)
    }

    if (!field.label) {
      return nodes
    }

    return h(Label, data, nodes)
  }
}

const CheckboxGroup = {
  functional: true,
  render (h, context) {
    const { name } = context.data.field.attrs
    const { description } = context.data.field
    const slots = context.slots().default || []

    const children = [ ...slots ]

    if (description) {
      children.unshift(h('legend', description))

      delete context.data.field.description
    }

    return h('fieldset', { attrs: { name } }, children)
  }
}

const Select = {
  functional: true,
  render (h, context) {
    const nodes = []
    const { field } = context.data
    const slots = context.slots().default || []
    const children = [ ...slots ]
    const listeners = context.data.on

    if (field.attrs.required || field.attrs.placeholder) {
      children.unshift(h('option', {
        attrs: {
          value: ''
        }
      }, field.attrs.placeholder))
    }

    const element = h('select', {
      ...context.data,
      on: {
        ...listeners,
        input (event) {
          listeners.input(getEventData(element, event))
        },
        change (event) {
          listeners.change(getEventData(element, event))
        }
      }
    }, children)
    nodes.push(element)

    if (field.description) {
      nodes.push(h('small', {
        attrs: field.descAttrs
      }, field.description))
    }

    return h(Label, context.data, nodes)
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

const ArrayButton = {
  functional: true,
  render (h, { data }) {
    return h('button', {
      attrs: { type: 'button', ...data.props },
      on: data.on
    }, 'Add')
  }
}

const Fieldset = {
  functional: true,
  render (h, { data, slots }) {
    const { field, newItemButton } = data
    const nodes = []

    if (field.isArrayField) {
      if (newItemButton) {
        nodes.push(h(ArrayInputs, slots().default))
        nodes.push(h(ArrayButton, newItemButton))
      } else {
        nodes.push(h(CheckboxGroup, data, slots().default))
      }
    } else {
      nodes.push(h(CheckboxGroup, data, slots().default))
    }

    if (field.description) {
      nodes.push(h('small', {
        attrs: field.descAttrs
      }, field.description))
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

const TAGS = {
  title: 'legend',
  description: 'p',
  form: 'form',
  text: Input,
  select: Select,
  option: 'option',
  fieldset: Fieldset
}

export class Components {
  constructor () {
    this.$ = {}

    for (const type in TAGS) {
      this.set(type, TAGS[type])
    }
  }

  set (type, component) {
    this.$[type] = { type, component }
  }

  input ({ field, fieldParent = null, listeners = {} }) {
    const { type } = field.attrs
    const hasItems = field.hasOwnProperty('items')
    const element = hasItems && groupedArrayTypes.includes(type)
      ? this.$.fieldset
      : this.$[type] || this.$[INPUT_TYPES.TEXT]

    const data = {
      field,
      fieldParent,
      components: this.components,
      attrs: { ...field.attrs },
      props: {
        type: field.attrs.type,
        label: field.label,
        value: field.attrs.value
      },
      domProps: {},
      on: listeners
    }

    return { element, data }
  }
}
