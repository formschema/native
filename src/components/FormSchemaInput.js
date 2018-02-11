import { components, elementOptions, inputName } from '../lib/components'
import FormSchemaInputDescription from './FormSchemaInputDescription'
import FormSchemaInputArrayElement from './FormSchemaInputArrayElement'

export default {
  functional: true,
  render (createElement, context) {
    const { description, field, element, input } = context.props
    const children = context.slots().default || []

    const descriptionElement = createElement(FormSchemaInputDescription, {
      props: {
        text: description || field.description
      }
    })

    if (field.isArrayField) {
      const vm = context.props.vm

      if (field.attrs.type === 'checkbox') {
        if (element.render) {
          return element.render(createElement, context)
        }

        const ref = input.ref

        return [
          createElement(FormSchemaInputArrayElement, {
            props: {
              vm, ref, field, input, element
            }
          }, children),
          descriptionElement
        ]
      }

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

      if (element.render) {
        return element.render(createElement, {
          ...context, slots: () => ({ default: nodes })
        }, nodes)
      }

      nodes.push(descriptionElement)

      return nodes
    }

    if (element.render) {
      return element.render(createElement, context)
    }

    return [
      createElement(element.component, input, children),
      descriptionElement
    ]
  }
}
