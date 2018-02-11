import { components, input as getInput } from '../lib/components'
import FormSchemaInput from './FormSchemaInput'
import FormSchemaWrappingInput from './FormSchemaWrappingInput'

export default {
  functional: true,
  render (createElement, context) {
    const { vm, item, ref, field, inputWrappingClass } = context.props

    const attrs = field.attrs
    const element = components[attrs.type]
    const description = item.description
    const input = getInput({
      ref,
      vm,
      field: {
        label: item.label,
        attrs: {
          name: item.name || attrs.name,
          type: attrs.type,
          value: item.value,
          checked: typeof context.props.checked === 'undefined'
            ? vm.data[attrs.name] instanceof Array
              ? vm.data[attrs.name].includes(item.value)
              : item.value === vm.data[attrs.name]
            : context.props.checked
        }
      }
    })

    return createElement(FormSchemaWrappingInput, {
      props: {
        vm, field, inputWrappingClass
      }
    }, [
      createElement(FormSchemaInput, {
        props: {
          vm, field, input, element, description
        }
      })
    ])
  }
}
