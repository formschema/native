import { components, input as getInput } from '@/lib/components'

export default {
  functional: true,
  render (createElement, { props }) {
    const { vm, option } = props

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

    return createElement(components.option.component, input.data, option.label)
  }
}
