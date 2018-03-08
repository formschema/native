import { input as getInput } from '@/lib/components'
import FormSchemaInput from './FormSchemaInput'

export default {
  functional: true,
  render (createElement, { props, listeners }) {
    const { item, field, value, checked, disableWrappingLabel } = props

    const { label, description } = item
    const attrs = {
      name: item.name || field.attrs.name,
      type: field.attrs.type,
      value: field.schemaType === 'boolean' ? undefined : item.value,
      checked: typeof checked === 'undefined'
        ? value instanceof Array
          ? value.includes(item.value)
          : item.value === value
        : checked
    }

    const input = getInput({
      field: { label, description, attrs },
      fieldParent: field,
      listeners
    })

    return createElement(FormSchemaInput, {
      props: {
        value,
        input,
        disableWrappingLabel,
        field: { ...field, label, description }
      },
      on: input.data.listeners
    })
  }
}
