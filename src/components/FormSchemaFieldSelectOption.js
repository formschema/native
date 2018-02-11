import { components, input as getInput } from '../lib/components'

export default {
  functional: true,
  render (createElement, context) {
    const { vm, option } = context.props

    const input = getInput({
      vm,
      field: {
        label: option.label,
        attrs: {
          type: undefined,
          value: option.value,
          selected: option.selected
        }
      }
    })

    return createElement(components.option.component, input, option.label)
  }
}
