export default {
  functional: true,
  render (createElement, { data, props }) {
    const { components } = data
    const { option, value } = props

    const field = {
      label: option.label,
      attrs: {
        value: option.value,
        selected: value instanceof Array
          ? value.includes(option.value)
          : typeof value === 'undefined'
            ? option.selected || false
            : option.value === value
      }
    }
    const inputData = components.input({ field }).data

    inputData.components = components

    return createElement(components.$.option.component, inputData, option.label)
  }
}
