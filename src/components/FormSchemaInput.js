import { genId, INPUT_TYPES } from '../lib/parser'
import { assign } from '../lib/object'
import { inputName } from '../lib/components'
import FormSchemaInputArrayElement from './FormSchemaInputArrayElement'

const unwrappingElements = [ INPUT_TYPES.CHECKBOX, INPUT_TYPES.RADIO ]

export const INPUT_ADDED_EVENT = 'array-button-clicked'

export default {
  functional: true,
  render (createElement, { data, props, slots, listeners }) {
    const { input, field, components } = data
    const { value } = props
    const children = slots().default || []

    if (field.isArrayField && field.attrs.type !== INPUT_TYPES.SELECT) {
      const { name } = field.attrs
      const data = {
        input,
        field,
        components,
        attrs: {},
        props: { name, value },
        on: listeners
      }

      if (unwrappingElements.includes(field.attrs.type)) {
        assign(data.attrs, input.data.field.attrs)

        return createElement(FormSchemaInputArrayElement, data, children)
      }

      const { id = genId(name) } = input.data.attrs
      const inputs = Array(...Array(field.itemsNum)).map((v, i) => {
        data.props.name = inputName(field, i)
        input.data.attrs['data-fs-index'] = i

        if (i) {
          input.data.attrs.id = `${id}-${i}`
        } else {
          input.data.attrs.id = id
        }

        return createElement(FormSchemaInputArrayElement, data, children)
      })

      const newItemButton = {
        props: {
          disabled: field.maxItems <= field.itemsNum
        },
        on: {
          click (e) {
            if (field.itemsNum < field.maxItems) {
              field.itemsNum++

              if (INPUT_ADDED_EVENT in listeners) {
                listeners[INPUT_ADDED_EVENT](e)
              }
            }
          }
        }
      }

      return createElement(components.$.fieldset.component, {
        field,
        newItemButton,
        on: listeners
      }, inputs)
    }

    return createElement(input.element.component, input.data, children)
  }
}
