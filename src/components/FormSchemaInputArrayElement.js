import { assign } from '../lib/object'

export default {
  functional: true,
  render (createElement, { data, props, slots }) {
    const { input, field, components } = data
    const { value, name = field.attrs.name } = props
    const inputData = assign({}, input.data)

    inputData.attrs.name = name
    inputData.props.name = inputData.attrs.name
    inputData.attrs.value = typeof value === 'object' ? value[name] : value
    inputData.props.value = inputData.attrs.value
    inputData.components = components

    return createElement(input.element.component, inputData, slots().default)
  }
}
