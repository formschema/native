import { components } from '@/lib/components'

export default {
  functional: true,
  render (createElement, { data, slots }) {
    const slotsValue = slots()
    const buttonsWrapper = components.buttonswrapper

    if (slotsValue.default) {
      return createElement(
        buttonsWrapper.component, data, slotsValue.default)
    }

    return createElement(buttonsWrapper.component, [
      createElement(components.submitbutton.component, data)
    ])
  }
}
