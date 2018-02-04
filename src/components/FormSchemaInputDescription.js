export default {
  functional: true,
  render (createElement, context) {
    if (context.props.text) {
      return createElement('small', context.props.text)
    }

    return null
  }
}
