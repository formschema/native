import { components, option, elementOptions } from '../lib/components'
import FormSchemaInput from './FormSchemaInput'

const groupedArrayTypes = ['radio', 'checkbox', 'input', 'textarea']

export default {
  functional: true,
  render (createElement, context) {
    const vm = context.parent
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
          input.domProps.innerHTML = vm.data[attrs.name]
        }
        break

      case 'radio':
      case 'checkbox':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item) => {
            const itemOptions = elementOptions(
              this, components[attrs.type], item, item, item)

            children.push(createElement(
              components[attrs.type].component, itemOptions, item.label))
          })
        }
        break

      case 'select':
        if (!field.required) {
          children.push(createElement(components.option.component, {
            attrs: { value: '' }
          }))
        }

        field.items.forEach((option) => {
          const optionOptions = elementOptions(this, components.option, {
            value: option.value
          }, field)

          children.push(createElement(components.option.component, {
            domProps: {
              value: option.value
            },
            ...optionOptions
          }, option.label))
        })
        break
    }

    const formControlsNodes = []

    if (field.label && !option.disableWrappingLabel) {
      const extendingOptions = components.label.native
        ? {}
        : { label: field.label }
      const labelOptions = elementOptions(
        vm, components.label, extendingOptions, field)
      const labelNodes = []

      if (components.label.option.native) {
        labelNodes.push(createElement('span', {
          attrs: {
            'data-required-field': field.required ? 'true' : 'false'
          }
        }, field.label))
      }

      labelNodes.push(createElement(FormSchemaInput, {
        props: {
          vm, field, input, element
        }
      }))

      formControlsNodes.push(createElement(
        components.label.component, labelOptions, labelNodes))
    } else {
      formControlsNodes.push(createElement(FormSchemaInput, {
        props: {
          vm, field, input, element
        }
      }))
    }

    if (context.props.inputWrappingClass) {
      return createElement('div', {
        class: context.props.inputWrappingClass
      }, formControlsNodes)
    }

    return formControlsNodes
  }
}
