import { components, input as getInput } from '../lib/components'

export default {
  functional: true,
  render (createElement, context) {
    const vm = context.props.vm
    const option = context.props.option
    const field = context.props.field
    const attrs = field.attrs

    const input = getInput({
      vm,
      field: {
        label: option.label,
        attrs: {
          type: attrs.type,
          value: option.value
        }
      }
    })

    return createElement(components.option.component, input, option.label)
  }
}
