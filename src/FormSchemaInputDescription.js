export default {
  functional: true,
  render (createElement, context) {
    if (context.props.field.description) {
      return createElement('small', context.props.field.description)
    }

    return null
  }
}
