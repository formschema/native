import { components, elementOptions } from '../lib/components'
import FormSchemaInputDescription from './FormSchemaInputDescription'
import FormSchemaInputArrayElement from './FormSchemaInputArrayElement'

export const inputName = (field, index) => `${field.attrs.name}-${index}`

export default {
  functional: true,
  render (createElement, context) {
    const field = context.props.field
    const input = context.props.input
    const element = context.props.element

    const descriptionElement = createElement(FormSchemaInputDescription, {
      props: { field }
    })

    const children = context.slots().default

    if (field.isArrayField) {
      const vm = context.props.vm
      const nodes = Array.apply(null, Array(field.itemsNum)).map((v, i) => {
        const ref = inputName(field, i)

        return createElement(FormSchemaInputArrayElement, {
          props: {
            vm, ref, field, input, element
          }
        }, children)
      })

      const labelOptions = elementOptions(vm, components.label, {}, field)
      const button = components.arraybutton
      const buttonOptions = {
        ...elementOptions(vm, button, {
          disabled: field.maxItems <= field.itemsNum
        }, field),
        on: {
          click: () => {
            if (field.itemsNum < field.maxItems) {
              field.itemsNum++
              vm.$forceUpdate()
            }
          }
        }
      }
      const label = button.option.label || button.defaultOption.label
      const buttonElement = createElement(
        button.component, buttonOptions, label)

      nodes.push(createElement(
        components.label.component, labelOptions, [buttonElement]))

      nodes.push(descriptionElement)

      return nodes
    }

    return [
      createElement(element.component, input, children),
      descriptionElement
    ]
  }
}
