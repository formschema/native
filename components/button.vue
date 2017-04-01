<template>
  <button class="uk-button"
    :type="type"
    :class="classes"
    :disabled="disabled" @click="click">
      <slot>{{ label }}</slot></button>
</template>

<script>
  const types = {
    default: 'uk-button-default',
    primary: 'uk-button-primary',
    secondary: 'uk-button-secondary',
    danger: 'uk-button-danger'
  }
  
  export default {
    name: 'v-button',
    props: {
      type: { type: String, default: 'button' },
      ukType: { type: String, default: 'default' },
      label: { type: String, default: 'Button' },
      disabled: { type: Boolean, default: false }
    },
    computed: {
      classes() {
        return {
          [types[this.ukType]]: true
        }
      }
    },
    methods: {
      click (e) {
        this.$emit('click', e)
      }
    }
  }
</script>
