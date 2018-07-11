import { assign } from '../lib/object'

export default {
  functional: true,
  render (createElement, { data, props, slots, listeners }) {
    const { input, field, components } = data
    const { value, name = field.attrs.name } = props
    const inputData = assign({}, input.data)

    inputData.attrs.name = inputData.props.name = name
    inputData.attrs.value = inputData.props.value = typeof value === 'object'
      ? value[name]
      : value

    inputData.components = components

    return createElement(input.element.component, inputData, slots().default)
  }
}
