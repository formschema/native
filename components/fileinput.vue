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
    <div v-if="errorMessage" class="uk-alert-danger" uk-alert>
      {{ errorMessage }}</div>
  </div>
</template>

<script>
  export default {
    name: 'v-fileinput',
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
        errorMessage: null
      }
    },
    computed: {
      hasError () {
        return typeof this.errorMessage === 'string'
      },
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
      isEmpty () {
        return !this.value || this.value.length === 0
      },
      invalid (e) {
        this.setError(this.title)
        this.$emit('invalid', e)
      },
      input (e) {
        this.value = e.target.value
        this.clearError()

        this.$emit('input', this.value)

        if (this.value !== this.initialValue) {
          this.$emit('changed')
        }
      },
      setError (message) {
        this.errorMessage = message
      },
      clearError () {
        this.errorMessage = null
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
    visibility: hidden;
    padding-left: 15px;
    padding-right: 15px;
  }
  
  
  input + .uk-alert-danger {
    font-size: .9em;
    text-align: left;
    margin-top: 0;
    padding-top: 7px;
    padding-bottom: 7px;
  }
</style>
