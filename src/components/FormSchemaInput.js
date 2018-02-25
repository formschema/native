import { components, inputName, argName } from '@/lib/components'
import FormSchemaInputArrayElement from './FormSchemaInputArrayElement'

export default {
  functional: true,
  render (createElement, { props, slots }) {
    const { vm, description, field, input, disableWrappingLabel } = props
    const children = slots().default || []
    const descriptionValue = description || field.description

    const descriptionElement = descriptionValue
      ? createElement(components.inputdesc.component, descriptionValue)
      : null

    if (field.isArrayField) {
      if (field.attrs.type === 'checkbox') {
        const name = field.attrs.name
        const data = {
          props: {
            vm, name, field, input
          }
        }

        return createElement(components.inputwrapper.component, data, [
          createElement(FormSchemaInputArrayElement, data, children),
          descriptionElement
        ])
      }

      const nodes = Array.apply(null, Array(field.itemsNum)).map((v, i) => {
        const name = inputName(field, i)

        return createElement(FormSchemaInputArrayElement, {
          props: {
            vm, name, field, input
          }
        }, children)
      })

      const button = components.arraybutton
      const buttonData = {
        [argName(button)]: {
          disabled: field.maxItems <= field.itemsNum
        },
        on: {
          click () {
            if (field.itemsNum < field.maxItems) {
              field.itemsNum++
              vm.$forceUpdate()
            }
          }
        }
      }

      nodes.push(createElement(button.component, buttonData))
      nodes.push(descriptionElement)

      return createElement(components.inputswrapper.component, {
        props: { vm, field }
      }, nodes)
    }

    const nodes = [
      createElement(input.element.component, input.data, children),
      descriptionElement
    ]

    if (disableWrappingLabel) {
      return nodes
    }

    return createElement(components.inputwrapper.component, {
      props: { vm, field }
    }, nodes)
  }
}
