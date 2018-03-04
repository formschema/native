import { merge } from '@/lib/object'
import { argName } from '@/lib/components'

export default {
  functional: true,
  render (createElement, { props, slots, listeners }) {
    const { input, field, value = field.attrs.value, name = field.attrs.name } = props
    const attrName = argName(input)
    const data = {}

    merge(data, input.data)

    data.$field = field

    data[attrName] = { ...input.data[attrName] }
    data[attrName].name = name
    data[attrName].value = typeof value === 'object' ? value[name] : value

    return createElement(input.element.component, data, slots().default)
  }
}
