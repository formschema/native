import { components, render } from '../lib/components'

export default {
  functional: true,
  render (createElement, context) {
    const vm = context.parent
    const slots = context.slots()
    const buttonswrapper = components.buttonswrapper

    if (slots.default) {
      return render(createElement, context, buttonswrapper, vm, slots.default)
    }

    const button = components.submitbutton
    const label = button.option.label || button.defaultOption.label
    const nodes = [
      render(createElement, context, button, vm, label)
    ]

    return render(createElement, context, buttonswrapper, vm, nodes)
  }
}
