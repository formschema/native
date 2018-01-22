import { components, input as getInput } from '../lib/components'
import FormSchemaInput from './FormSchemaInput'
import FormSchemaWrappingInput from './FormSchemaWrappingInput'

export default {
  functional: true,
  render (createElement, context) {
    const { vm, item, ref, field, inputWrappingClass } = context.props

    const attrs = field.attrs
    const element = components[attrs.type] || components.text
    const input = getInput({
      ref,
      vm,
      field: {
        label: item.label,
        attrs: {
          name: item.name || context.props.name || attrs.name,
          type: attrs.type,
          value: item.value,
          checked: typeof context.props.checked === 'undefined'
            ? item.value === vm.inputValues[attrs.name]
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
          vm, field, input, element
        }
      })
    ])
  }
}
