import { SCHEMA_TYPES, INPUT_TYPES } from '../lib/parser'
import FormSchemaInput from './FormSchemaInput'
import FormSchemaFieldCheckboxItem from './FormSchemaFieldCheckboxItem'
import FormSchemaFieldSelectOption from './FormSchemaFieldSelectOption'

const FormSchemaField = {
  functional: true,
  render (createElement, { data, props, listeners }) {
    const { field, components } = data
    const { value } = props

    const input = components.input({ field, listeners })
    const children = []

    switch (field.attrs.type) {
      case INPUT_TYPES.TEXTAREA:
        delete input.data.attrs.type
        delete input.data.attrs.value

        input.data.domProps.innerHTML = value
        break

      case INPUT_TYPES.RADIO:
      case INPUT_TYPES.SWITCH:
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
        }

        break

      case INPUT_TYPES.CHECKBOX:
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
        } else if (field.schemaType === SCHEMA_TYPES.BOOLEAN) {
          return createElement(FormSchemaFieldCheckboxItem, {
            field,
            components,
            props: {
              item: { label: field.label, id: field.attrs.id },
              value,
              checked: value === true
            },
            on: listeners
          })
        }

        break

      case INPUT_TYPES.SELECT:
        delete input.data.attrs.type
        delete input.data.attrs.value

        field.items.forEach((option) => {
          children.push(createElement(FormSchemaFieldSelectOption, {
            field,
            components,
            props: { option, value },
            on: listeners
          }))
        })
        break

      // Adding handling of object fields (recursive calling of
      // createElement with FormSchemaField for each child)
      case INPUT_TYPES.OBJECT:
        field.fields.forEach((child) => {
          children.push(createElement(FormSchemaField, {
            field: child,
            components,
            props: { value: value[child.attrs.name] },
            on: listeners
          }))
        })

        return createElement(components.$.fieldset.component, {
          field,
          on: listeners
        }, children)
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

export default FormSchemaField
