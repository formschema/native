import { SCHEMA_TYPES, INPUT_TYPES } from '../lib/parser'
import FormSchemaInput from './FormSchemaInput'

export default {
  functional: true,
  render (createElement, { data, props, listeners, parent }) {
    const { field, components } = data
    const { item, value, checked } = props

    const { label, description } = item
    const attrs = {
      id: item.id,
      name: field.attrs.name,
      type: field.attrs.type,
      value: field.schemaType === SCHEMA_TYPES.BOOLEAN ? undefined : item.value,
      checked: typeof checked === 'undefined'
        ? value instanceof Array
          ? value.includes(item.value)
          : item.value === value
        : checked
    }

    if (attrs.name
      && parent.bracketedArrayInputName
      && field.attrs.type === INPUT_TYPES.CHECKBOX
      && field.isArrayField) {
      attrs.name = `${attrs.name}[]`
    }

    const labelAttrs = {
      for: item.id
    }

    const input = components.input({
      field: {
        label,
        labelAttrs,
        description,
        path: field.path,
        attrs
      },
      fieldParent: field,
      listeners
    })

    if (field.isArrayField) {
      input.data.field.attrs['data-fs-array-value'] = value
    }

    return createElement(FormSchemaInput, {
      input,
      components,
      on: input.data.on,
      props: { value },
      field: { ...field, label, labelAttrs, description, attrs }
    })
  }
}
