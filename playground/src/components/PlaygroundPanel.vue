<template>
  <div class="playground-panel">
    <div class="playground-panel__header">
      <slot name="header"/>
    </div>
    <div class="playground-panel__body">
      <slot name="body"/>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .playground-panel
    display: flex
    flex-direction: column

    &__header, &__body
      display: flex
      align-items: flex-start
      width: 100%

    &__header
      flex-direction: row

      margin: 0
      padding: 8px
      font-size: 12px
      font-weight: 400
      border-bottom: 1px solid rgba(255, 255, 255, .1)

    &__body
      flex: 1
      flex-direction: column
      overflow: auto
</style>
