import { argName } from '@/lib/components'

export default {
  functional: true,
  render (createElement, { props, slots, listeners }) {
    const { input, field, value, name = field.attrs.name } = props
    const attrName = argName(input)

    const attrs = {
      ...input.data[attrName],
      name,
      value: typeof value === 'object' ? value[name] : value
    }

    return createElement(input.element.component, {
      ...input.data, [attrName]: attrs
    }, slots().default)
  }
}
