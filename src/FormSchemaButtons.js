import { components, option, elementOptions } from '../lib/components'

export default {
  functional: true,
  render (createElement, context) {
    const vm = context.parent
    const buttonWrapper = components.button.option.native
      ? components.defaultGroup : components.label
    const labelOptions = elementOptions(vm, buttonWrapper)
    const slots = context.slots()
    const button = slots.default
      ? { component: slots.default, option }
      : components.button

    if (button.component instanceof Array) {
      return createElement(
        buttonWrapper.component, labelOptions, button.component)
    }

    const label = button.option.label || button.defaultOption.label
    const buttonOptions = elementOptions(vm, button, { type: 'submit' })

    if (button.option.native) {
      delete buttonOptions.attrs.label
    }

    return createElement(buttonWrapper.component, labelOptions, [
      createElement(button.component, buttonOptions, label)
    ])
  }
}
