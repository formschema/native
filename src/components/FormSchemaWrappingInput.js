import { components, option, elementOptions } from '../lib/components'

export default {
  functional: true,
  render (createElement, context) {
    const vm = context.props.vm
    const field = context.props.field

    let nodes = []

    if (field.label && !option.disableWrappingLabel) {
      const extendingOptions = components.label.native
        ? {}
        : { label: field.label }
      const labelOptions = elementOptions(
        vm, components.label, extendingOptions, field)
      let labelNodes = []

      if (components.label.option.native) {
        labelNodes.push(createElement('span', {
          attrs: {
            'data-required-field': field.required ? 'true' : 'false'
          }
        }, field.label))
      }

      labelNodes = labelNodes.concat(context.children)

      nodes.push(createElement(
        components.label.component, labelOptions, labelNodes))
    } else {
      nodes = context.children
    }

    if (context.props.inputWrappingClass) {
      return createElement('div', {
        class: context.props.inputWrappingClass
      }, nodes)
    }

    return nodes
  }
}
