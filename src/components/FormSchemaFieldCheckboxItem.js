import { input as getInput } from '@/lib/components'
import FormSchemaInput from './FormSchemaInput'

export default {
  functional: true,
  render (createElement, { props, listeners }) {
    const { item, field, value = field.attrs.value, checked, disableWrappingLabel } = props

    const attrs = field.attrs
    const description = item.description
    const input = getInput({
      ref: item.ref,
      field: {
        label: item.label,
        attrs: {
          name: item.name || attrs.name,
          type: attrs.type,
          value: field.schemaType === 'boolean' ? undefined : item.value,
          checked: typeof checked === 'undefined'
            ? value instanceof Array
              ? value.includes(item.value)
              : item.value === value
            : checked
        },
        $field: { ...field, label: item.label }
      },
      listeners
    })

    return createElement(FormSchemaInput, {
      props: {
        value,
        input,
        description,
        disableWrappingLabel,
        field: { ...field, label: item.label }
      },
      on: input.data.listeners
    })
  }
}
