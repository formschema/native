<template>
  <div>
    <textarea class="uk-textarea"
      :class="classes"
      :name="name"
      :value="value"
      :title="title"
      :rows="rows" 
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled" 
      :required="required"
      @invalid="invalid"
      @keyup="keyup"
      @input="input"></textarea>
    <div v-if="errorMessage" class="uk-alert-danger" uk-alert>
      {{ errorMessage }}</div>
  </div>
</template>

<script>
  export default {
    name: 'v-textarea',
    props: {
      name: { type: String },
      rows: { type: Number },
      value: { type: String },
      title: { type: String },
      placeholder: { type: String },
      maxlength: {
        type: Number,
        validation: (value) => value > 0
      },
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
      keyup (e) {
        this.$emit('keyup')
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
  textarea {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  textarea + .uk-alert-danger {
    font-size: .9em;
    text-align: left;
    margin-top: 0;
    padding-top: 7px;
    padding-bottom: 7px;
  }
</style>
