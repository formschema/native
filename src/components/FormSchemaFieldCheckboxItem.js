import FormSchemaInput from './FormSchemaInput'

export default {
  functional: true,
  render (createElement, { data, props, listeners }) {
    const { field, components } = data
    const { item, value, checked, disableWrappingLabel } = props

    const { label, description } = item
    const attrs = {
      id: item.id,
      name: item.name || field.attrs.name,
      type: field.attrs.type,
      value: field.schemaType === 'boolean' ? undefined : item.value,
      checked: typeof checked === 'undefined'
        ? value instanceof Array
          ? value.includes(item.value)
          : item.value === value
        : checked
    }

    const input = components.input({
      field: { label, description, attrs },
      fieldParent: field,
      listeners
    })

    return createElement(FormSchemaInput, {
      input,
      props: {
        value,
        disableWrappingLabel
      },
      on: input.data.listeners,
      field: { ...field, label, description, attrs },
      components
    })
  }
}
