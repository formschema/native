import { inputName } from '../lib/components'

export default {
  functional: true,
  render (createElement, context) {
    const field = context.props.field
    const input = context.props.input
    const element = context.props.element
    const vm = context.props.vm
    const name = context.props.ref

    const attrs = field.attrs
    const value = vm.inputValues[name]
    const attrName = element.option.native ? 'attrs' : 'props'

    return createElement(element.component, {
      ...input,
      ref: name,
      [attrName]: { ...input[attrName], name, value },
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
        change: vm.changed
      }
    }, context.slots().default)
  }
}
