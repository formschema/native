<template>
  <span>
    <input class="uk-input" type="checkbox" 
      :class="classes"
      :name="name"
      :value="value"
      :title="title"
      :checked="checked"
      :disabled="disabled" 
      :required="required"
      @invalid="invalid"
      @changed="changed">
    <slot>{{ label }}</slot>
  </span>
</template>

<script>
  export default {
    name: 'v-checkbox',
    props: {
      name: { type: String },
      value: { type: String },
      title: { type: String },
      label: { type: String },
      checked: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      dataClassError: { type: String, default: 'uk-form-danger' }
    },
    data () {
      return {
        hasError: false
      }
    },
    computed: {
      classes () {
        return {
          [this.dataClassError]: this.hasError
        }
      }
    },
    methods: {
      invalid (e) {
        this.hasError = true
        this.$emit('invalid', e)
      },
      changed (e) {
        this.value = e.target.value
        this.hasError = false

        this.$emit('changed', this.value)
      }
    }
  }
</script>
