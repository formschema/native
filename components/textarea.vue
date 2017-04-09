<template>
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
      },
      keyup (e) {
        this.$emit('keyup')
      }
    }
  }
</script>
