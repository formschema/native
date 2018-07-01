import FormSchemaInput from './FormSchemaInput'

export default {
  functional: true,
  render (createElement, { props, listeners }) {
    const { item, field, value, checked, disableWrappingLabel, components } = props

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
      props: {
        value,
        input,
        disableWrappingLabel,
        components,
        field: { ...field, label, description, attrs }
      },
      on: input.data.listeners
    })
  }
}
