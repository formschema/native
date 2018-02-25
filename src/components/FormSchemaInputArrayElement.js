import { merge } from '@/lib/object'
import { inputName, argName } from '@/lib/components'

export default {
  functional: true,
  render (createElement, { props, slots }) {
    const { vm, input, field, name = field.attrs.name } = props

    const attrs = field.attrs
    const attrName = argName(input)
    const value = attrs.type === 'checkbox'
      ? input.data[attrName].value
      : vm.inputValues[name]

    const ref = input.ref || name
    const data = {}

    merge(data, input.data)

    data.$field = field

    data[attrName] = { ...input.data[attrName] }
    data[attrName].name = name
    data[attrName].value = value

    data.on = {
      input (event) {
        const value = event && event.target ? event.target.value : event

        vm.inputValues[ref] =
          attrs.type === 'checkbox' && vm.inputValues[ref] !== undefined
            ? undefined
            : value

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
      change () {
        /**
         * Fired synchronously when the value of an element is changed.
         */
        vm.$emit('change', vm.data)
      }
    }

    return createElement(input.element.component, data, slots().default)
  }
}
