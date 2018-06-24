import { argName } from '@/lib/components'
import { assign } from '@/lib/object'

export default {
  functional: true,
  render (createElement, { props, slots, listeners }) {
    const { input, field, value, name = field.attrs.name } = props
    const attrName = argName(input)
    const data = assign({}, input.data)

    data[attrName].name = name
    data[attrName].value = typeof value === 'object' ? value[name] : value

    return createElement(input.element.component, data, slots().default)
  }
}
