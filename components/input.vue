<template>
  <input class="uk-input"
    :class="classes"
    :type="type" 
    :name="name"
    :value="value"
    :title="title"
    :placeholder="placeholder"
    :minlength="minlength"
    :maxlength="maxlength"
    :disabled="disabled" 
    :required="required"
    :autocomplete="autocomplete"
    @invalid="invalid"
    @keyup="keyup"
    @input="input">
</template>

<script>
  export default {
    name: 'v-input',
    props: {
      type: { type: String, default: 'text' },
      name: { type: String },
      value: { type: String },
      title: { type: String },
      placeholder: { type: String },
      minlength: {
        type: Number,
        validation: (value) => value > 0
      },
      maxlength: {
        type: Number,
        validation: (value) => value > 0 && value > this.minlenth
      },
      disabled: { type: Boolean, default: false },
      required: { type: Boolean, default: false },
      autocomplete: { type: String, default: null },
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
