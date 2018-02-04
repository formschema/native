export default {
  functional: true,
  render (createElement, context) {
    if (context.props.description) {
      return createElement('small', context.props.description)
    }

    return null
  }
}
