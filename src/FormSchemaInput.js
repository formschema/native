import { components } from '../lib/components'
import { equals } from '../lib/object'

export const inputName = (field, index) => `${field.attrs.name}-${index}`

export default {
  functional: true,
  render (createElement, context) {
    const field = context.props.field
    const input = context.props.input
    const element = context.props.element

    if (field.isArrayField) {
      const attrs = field.attrs
      const nodes = new Array(field.itemsNum).map((v, i) => {
        const name = inputName(field, i)
        const value = this.inputValues[name]
        const propsValue = { name, value }

        return createElement(element.component, {
          ...input,
          ref: name,
          props: propsValue,
          domProps: propsValue,
          on: {
            input: (event) => {
              this.inputValues[name] = event && event.target
                ? event.target.value
                : event

              const values = []

              for (let j = 0; j < field.itemsNum; j++) {
                const currentValue = this.inputValues[inputName(field, j)]

                if (currentValue) {
                  values.push(currentValue)
                }
              }

              this.data[attrs.name] = values

              /**
                * Fired synchronously when the value of an element is changed.
                */
              this.$emit('input', this.data)
            },
            change: () => {
              if (!equals(this.data, this.default)) {
                /**
                 * Fired when a change to the element's value is committed by the user.
                 */
                this.$emit('change', this.data)
              }
            }
          }
        }, context.slots.default)
      })

      const labelOptions = this.elementOptions(components.label, {}, field)
      const button = components.arraybutton
      const buttonOptions = {
        ...this.elementOptions(button, {
          disabled: field.maxItems <= field.itemsNum
        }, field),
        on: {
          click: () => {
            if (field.itemsNum < field.maxItems) {
              field.itemsNum++
              this.$forceUpdate()
            }
          }
        }
      }
      const label = button.option.label || button.defaultOption.label
      const buttonElement = createElement(
        button.component, buttonOptions, label)

      nodes.push(createElement(
        components.label.component, labelOptions, [buttonElement]))

      return nodes
    }

    return createElement(element.component, input, context.slots.default)
  }
}
