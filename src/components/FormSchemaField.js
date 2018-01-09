import { components, elementOptions, groupedArrayTypes } from '../lib/components'
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

    if (!attrs.value) {
      attrs.value = vm.data[attrs.name]
    }

    const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(attrs.type)
      ? components[`${attrs.type}group`] || components.defaultGroup
      : components[attrs.type] || components.text

    const fieldOptions = elementOptions(vm, element, attrs, field)
    const children = []

    const input = {
      ref: attrs.name,
      domProps: {
        value: vm.data[attrs.name]
      },
      on: {
        input: (event) => {
          vm.data[attrs.name] = event && event.target
            ? event.target.value
            : event

          /**
            * Fired synchronously when the value of an element is changed.
            */
          vm.$emit('input', vm.data)
        },
        change: vm.changed
      },
      ...fieldOptions
    }

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
