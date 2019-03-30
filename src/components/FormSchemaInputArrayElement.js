import { assign } from '../lib/object'

export default {
  functional: true,
  render (createElement, { data, props, slots, parent }) {
    const { input, field, components } = data
    const { value } = props
    let { name } = field.attrs
    const inputData = assign({}, input.data)
    const indexAttributeName = 'data-fs-index'

    if (parent.bracketedArrayInputName) {
      name = `${name}[]`
    }

    inputData.attrs.name = name
    inputData.props.name = name
    inputData.fieldParent = field
    // Setting value to an array item value if data-fs-index is present
    inputData.value = indexAttributeName in inputData.attrs
      ? value[inputData.attrs[indexAttributeName]]
      : value
    inputData.domProps.value = inputData.value
    inputData.attrs.value = inputData.value
    inputData.props.value = value
    inputData.attrs['data-fs-array-value'] = value.toString()
    inputData.components = components

    return createElement(input.element.component, inputData, slots().default)
  }
}
