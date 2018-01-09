import { input as getInput } from '../lib/components'
import FormSchemaInput from './FormSchemaInput'
import FormSchemaWrappingInput from './FormSchemaWrappingInput'
import FormSchemaFieldCheckboxItem from './FormSchemaFieldCheckboxItem'
import FormSchemaFieldSelectOption from './FormSchemaFieldSelectOption'

const FormSchemaField = {
  functional: true,
  render (createElement, context) {
    const vm = context.props.vm
    const inputWrappingClass = context.props.inputWrappingClass
    const field = context.props.field
    const attrs = field.attrs

    const input = getInput({ vm, field })
    const element = input.element
    const children = []

    switch (attrs.type) {
      case 'textarea':
        if (element.option.native) {
          delete input.attrs.type
          delete input.attrs.value

          input.domProps.innerHTML = vm.data[attrs.name]
        }
        break

      case 'radio':
      case 'checkbox':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item, i) => {
            children.push(createElement(FormSchemaFieldCheckboxItem, {
              props: { vm, field, item, disableWrappingLabel: true }
            }))
          })
        }
        break

      case 'select':
        if (!field.required) {
          const option = { label: null, value: '' }

          children.push(createElement(FormSchemaFieldSelectOption, {
            props: { vm, field, option, disableWrappingLabel: true }
          }))
        }

        field.items.forEach((option) => {
          children.push(createElement(FormSchemaFieldSelectOption, {
            props: { vm, field, option, disableWrappingLabel: true }
          }))
        })
        break
    }

    return createElement(FormSchemaWrappingInput, {
      props: {
        vm, field, inputWrappingClass
      }
    }, [
      createElement(FormSchemaInput, {
        props: {
          vm, field, input, element
        }
      }, children)
    ])
  }
}

export default FormSchemaField
