import { inputName, input as getInput } from '@/lib/components'
import FormSchemaInput from './FormSchemaInput'
import FormSchemaFieldCheckboxItem from './FormSchemaFieldCheckboxItem'
import FormSchemaFieldSelectOption from './FormSchemaFieldSelectOption'

export default {
  functional: true,
  render (createElement, { props }) {
    const { vm, field } = props
    const attrs = field.attrs

    const input = getInput({ vm, field })
    const children = []

    switch (attrs.type) {
      case 'textarea':
        if (input.element.native) {
          delete input.data.attrs.type
          delete input.data.attrs.value

          input.data.domProps.innerHTML = vm.data[attrs.name]
        }
        break

      case 'radio':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item, i) => {
            item.ref = inputName({ attrs: item }, i)

            children.push(createElement(FormSchemaFieldCheckboxItem, {
              props: {
                vm,
                item,
                field: { ...field, label: item.label, isArrayField: false }
              }
            }))
          })
        }
        break

      case 'checkbox':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item, i) => {
            item.ref = inputName({ attrs: item }, i)

            children.push(createElement(FormSchemaFieldCheckboxItem, {
              props: {
                vm,
                item,
                field: { ...field, label: item.label },
                checked: vm.data[field.attrs.name].includes(item.value)
              }
            }))
          })
        }
        break

      case 'select':
        const items = [ ...field.items ]

        if (!attrs.required) {
          items.unshift({ label: null, value: '' })
        }

        if (input.data.attrs) {
          delete input.data.attrs.type
          delete input.data.attrs.value
        }

        items.forEach((option) => {
          children.push(createElement(FormSchemaFieldSelectOption, {
            props: { vm, field, option, disableWrappingLabel: true }
          }))
        })
        break
    }

    return createElement(FormSchemaInput, {
      props: { vm, field, input }
    }, children)
  }
}
