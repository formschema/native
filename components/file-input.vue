<template>
  <div>
    <input type="file" 
      :id="id" 
      :name="name"
      :value="value"
      :title="title"
      :placeholder="placeholder" 
      :disabled="disabled"
      :required="required"
      @input="input">
    <label :for="id" class="uk-placeholder uk-text-center">
      {{ placeholder }}</label>
  </div>
</template>

<script>
  export default {
    name: 'v-file-input',
    props: {
      id: { type: String },
      name: { type: String },
      value: { type: String },
      title: { type: String },
      placeholder: { type: String, default: 'Select a file' },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      dataClassError: { type: String, default: 'uk-form-danger' }
    },
    data () {
      return {
        initialValue: null,
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
    created () {
      this.initialValue = this.value
    },
    methods: {
      invalid (e) {
        this.hasError = true
        this.$emit('invalid', e)
      },
      input (e) {
        this.value = e.target.value
        this.hasError = false

        this.$emit('input', this.value)

        if (this.value !== this.initialValue) {
          this.$emit('changed')
        }
      }
    }
  }
</script>

<style scoped>
  label {
    display: block;
    position: relative;
    z-index: 1;
    background-color: #fff
  }

  input {
    position: absolute;
    visibility: hidden
  }
</style>
