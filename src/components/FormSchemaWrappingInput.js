import { components, option, elementOptions } from '../lib/components'

export default {
  functional: true,
  render (createElement, { props, children }) {
    const { vm, field } = props
    let nodes = []

    if (field.label && !option.disableWrappingLabel) {
      const labelOptions = elementOptions(vm, components.label, {}, field)
      let labelNodes = []

      labelNodes.push(createElement('span', {
        attrs: {
          'data-required-field': field.attrs.required ? 'true' : 'false'
        }
      }, field.label))

      labelNodes = labelNodes.concat(children)

      nodes.push(createElement(
        components.label.component, labelOptions, labelNodes))
    } else {
      nodes = children
    }

    if (props.inputWrappingClass) {
      return createElement('div', {
        class: props.inputWrappingClass
      }, nodes)
    }

    return nodes
  }
}
