import { assign } from '@/lib/object'
import { inputName, argName } from '@/lib/components'
import FormSchemaInputArrayElement from './FormSchemaInputArrayElement'

const unwrappingElements = ['checkbox', 'radio']

export const INPUT_ADDED_EVENT = 'array-button-clicked'

export default {
  functional: true,
  render (createElement, { data, props, slots, listeners }) {
    const { input, field, components } = data
    const { value } = props
    const children = slots().default || []

    if (field.isArrayField && field.attrs.type !== 'select') {
      const name = field.attrs.name
      const data = {
        input,
        field,
        components,
        props: { name, value },
        on: listeners
      }

      if (unwrappingElements.includes(field.attrs.type)) {
        assign(data.props, input.data.field.attrs)

        return createElement(components.$.inputwrapper.component, data, [
          createElement(FormSchemaInputArrayElement, data, children)
        ])
      }

      const id = input.data.attrs.id
      const inputs = Array.apply(null, Array(field.itemsNum)).map((v, i) => {
        data.props.name = inputName(field, i)
        input.data.attrs['data-fs-index'] = i

        if (i) {
          input.data.attrs.id = id + '-' + i
        }

        return createElement(FormSchemaInputArrayElement, data, children)
      })

      return createElement(components.$.inputwrapper.component, { field }, [
        createElement(components.$.arrayInputs.component, { field }, inputs),
        createElement(components.$.arraybutton.component, {
          [argName(components.$.arraybutton)]: {
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
        })
      ])
    }

    const nodes = [
      createElement(input.element.component, input.data, children)
    ]

    return createElement(components.$.inputwrapper.component, { field }, nodes)
  }
}
