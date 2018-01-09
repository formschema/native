import { components, input as getInput } from '../lib/components'
import FormSchemaInput from './FormSchemaInput'
import FormSchemaWrappingInput from './FormSchemaWrappingInput'

const FormSchemaField = {
  functional: true,
  render (createElement, context) {
    const vm = context.props.vm
    const item = context.props.item
    const inputWrappingClass = context.props.inputWrappingClass
    const field = context.props.field
    const attrs = field.attrs

    if (!attrs.value) {
      attrs.value = vm.inputValues[attrs.name]
    }

    const element = components[attrs.type] || components.text
    const input = getInput({
      vm,
      field: {
        label: item.label,
        attrs: {
          type: attrs.type,
          value: item.value
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

export default FormSchemaField
