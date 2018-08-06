import { SCHEMA_TYPES } from '../lib/parser'
import FormSchemaInput from './FormSchemaInput'

export default {
  functional: true,
  render (createElement, { data, props, listeners }) {
    const { field, components } = data
    const { item, value, checked } = props

    const { label, description } = item
    const attrs = {
      id: item.id,
      name: item.name || field.attrs.name,
      type: field.attrs.type,
      value: field.schemaType === SCHEMA_TYPES.BOOLEAN ? undefined : item.value,
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
      components,
      on: input.data.listeners,
      props: { value: attrs.value },
      field: { ...field, label, description, attrs }
    })
  }
}
