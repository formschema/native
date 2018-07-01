import { assign } from '@/lib/object'

export default {
  functional: true,
  render (createElement, { props, slots, listeners }) {
    const { input, field, value, name = field.attrs.name, components } = props
    const data = assign({}, input.data)

    data.attrs.name = data.props.name = name
    data.attrs.value = data.props.value = typeof value === 'object'
      ? value[name]
      : value

    data.props.components = components

    return createElement(input.element.component, data, slots().default)
  }
}
