<template>
  <div>
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
    <div v-if="errorMessage" class="uk-alert-danger" uk-alert>
      {{ errorMessage }}</div>
  </div>
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
        hasError: false,
        errorMessage: null
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
        this.setError(this.title)
        this.$emit('invalid', e)
      },
      changed (e) {
        this.value = e.target.value
        this.clearError()

        this.$emit('changed', this.value)
      },
      setError (message) {
        this.hasError = true
        this.errorMessage = message
      },
      clearError () {
        this.hasError = false
        this.errorMessage = null
      }
    }
  }
</script>

<style scoped>
  input + .uk-alert-danger {
    font-size: .9em;
    text-align: left;
    margin-top: 0;
    padding-top: 7px;
    padding-bottom: 7px;
  }
</style>
