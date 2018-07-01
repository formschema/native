export default {
  functional: true,
  render (createElement, { props }) {
    const { option, value, components } = props

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
    const data = components.input({ field }).data

    data.props.components = components

    return createElement(components.$.option.component, data, option.label)
  }
}
