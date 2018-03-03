import { input as getInput } from '@/lib/components'
import FormSchemaInput from './FormSchemaInput'

export default {
  functional: true,
  render (createElement, { props }) {
    const { vm, item, field, checked, disableWrappingLabel } = props

    const attrs = field.attrs
    const description = item.description
    const input = getInput({
      vm,
      ref: item.ref,
      field: {
        label: item.label,
        attrs: {
          name: item.name || attrs.name,
          type: attrs.type,
          value: item.value,
          checked: typeof checked === 'undefined'
            ? vm.data[attrs.name] instanceof Array
              ? vm.data[attrs.name].includes(item.value)
              : item.value === vm.data[attrs.name]
            : checked
        }
      }
    })

    input.data.$field = { ...field, label: item.label }

    return createElement(FormSchemaInput, {
      props: {
        vm,
        field: input.data.$field,
        input,
        description,
        disableWrappingLabel
      }
    })
  }
}
