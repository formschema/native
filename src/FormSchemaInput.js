import { components, elementOptions } from '../lib/components'
import { equals } from '../lib/object'
import FormSchemaInputDescription from './FormSchemaInputDescription'

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
      const attrs = field.attrs
      const nodes = Array.apply(null, Array(field.itemsNum)).map((v, i) => {
        const name = inputName(field, i)
        const value = vm.inputValues[name]
        const propsValue = { name, value }

        return createElement(element.component, {
          ...input,
          ref: name,
          props: propsValue,
          domProps: propsValue,
          on: {
            input: (event) => {
              vm.inputValues[name] = event && event.target
                ? event.target.value
                : event

              const values = []

              for (let j = 0; j < field.itemsNum; j++) {
                const currentValue = vm.inputValues[inputName(field, j)]

                if (currentValue) {
                  values.push(currentValue)
                }
              }

              vm.data[attrs.name] = values

              /**
                * Fired synchronously when the value of an element is changed.
                */
              vm.$emit('input', vm.data)
            },
            change: () => {
              if (!equals(vm.data, vm.default)) {
                /**
                 * Fired when a change to the element's value is committed by the user.
                 */
                vm.$emit('change', vm.data)
              }
            }
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
