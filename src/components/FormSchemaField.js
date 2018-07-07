import FormSchemaInput from './FormSchemaInput'
import FormSchemaFieldCheckboxItem from './FormSchemaFieldCheckboxItem'
import FormSchemaFieldSelectOption from './FormSchemaFieldSelectOption'

export default {
  functional: true,
  render (createElement, { data, props, listeners }) {
    const { field, components } = data
    const { value } = props

    const input = components.input({ field, listeners })
    const children = []

    switch (field.attrs.type) {
      case 'textarea':
        if (input.element.native) {
          delete input.data.attrs.type
          delete input.data.attrs.value

          input.data.domProps.innerHTML = value
        }
        break

      case 'radio':
      case 'switch':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item) => {
            children.push(createElement(FormSchemaFieldCheckboxItem, {
              field: { ...field, isArrayField: false },
              components,
              fieldParent: field,
              props: { item, value },
              on: listeners
            }))
          })
        }
        break

      case 'checkbox':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item) => {
            children.push(createElement(FormSchemaFieldCheckboxItem, {
              field,
              components,
              fieldParent: field,
              props: { item, value },
              on: listeners
            }))
          })
        } else if (field.schemaType === 'boolean') {
          const item = { label: field.label, id: field.attrs.id }
          const checked = value === true

          return createElement(FormSchemaFieldCheckboxItem, {
            field,
            components,
            props: { item, value, checked },
            on: listeners
          })
        }
        break

      case 'select':
        const items = [ ...field.items ]

        if (field.attrs.required) {
          items.unshift({ label: null, value: '' })
        }

        if (input.element.native) {
          delete input.data.attrs.type
          delete input.data.attrs.value
        }

        items.forEach((option) => {
          children.push(createElement(FormSchemaFieldSelectOption, {
            field,
            components,
            props: { option, value },
            on: listeners
          }))
        })
        break
    }

    return createElement(FormSchemaInput, {
      input,
      field,
      components,
      props: { value },
      on: listeners
    }, children)
  }
}
