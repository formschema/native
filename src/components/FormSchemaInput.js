import { components, inputName, argName } from '@/lib/components'
import FormSchemaInputArrayElement from './FormSchemaInputArrayElement'

export default {
  functional: true,
  render (createElement, { props, slots, listeners }) {
    const { description, field, value = field.attrs.value, input, disableWrappingLabel } = props
    const children = slots().default || []
    const descriptionValue = description || field.description

    const descriptionElement = descriptionValue
      ? createElement(components.inputdesc.component, descriptionValue)
      : null

    if (field.isArrayField && field.attrs.type !== 'select') {
      if (field.attrs.type === 'checkbox') {
        const name = field.attrs.name
        const data = {
          props: {
            name, field, value, input
          },
          on: listeners
        }

        return createElement(components.inputwrapper.component, data, [
          createElement(FormSchemaInputArrayElement, data, children),
          descriptionElement
        ])
      }

      const inputs = Array.apply(null, Array(field.itemsNum)).map((v, i) => {
        const name = inputName(field, i)

        input.data.attrs['data-fs-index'] = i

        return createElement(FormSchemaInputArrayElement, {
          props: {
            name, field, value, input
          },
          on: listeners
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
            }
          }
        }
      }

      inputs.push(createElement(button.component, buttonData))
      inputs.push(descriptionElement)

      return createElement(components.inputwrapper.component, {
        props: { field }
      }, [
        createElement(components.inputswrapper.component, {
          props: { field }
        }, inputs)
      ])
    }

    const nodes = [
      createElement(input.element.component, input.data, children),
      descriptionElement
    ]

    if (disableWrappingLabel) {
      return nodes
    }

    return createElement(components.inputwrapper.component, {
      props: { field }
    }, nodes)
  }
}
