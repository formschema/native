<template>
  <select 
    :id="id" 
    :name="name"
    :class="classes"
    :multiple="multiple" 
    :required="required" 
    :disabled="disabled" 
    @invalid="invalid"
    @change="input">
    <option 
      value="" 
      class="placeholder" 
      :selected.once="!value">
        {{ placeholder }}</option>
    <option v-for="item of options"
      :value="item.value || item.label" 
      :selected="item.value === value">
        {{ item.label }}</option>
  </select>
</template>

<script>
  export default {
    name: 'v-select',
    props: {
      id: { type: String },
      name: { type: String },
      value: { type: String },
      title: { type: String },
      options: { type: Array },
      multiple: { type: Boolean },
      placeholder: { type: String },
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
          placeholder: !this.value,
          [this.dataClassError]: this.hasError
        }
      },
      currentValue () {
        return this.value
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
        console.log(this.value)
        if (this.value !== this.initialValue) {
          this.$emit('changed')
        }
      }
    }
  }
</script>

<style scoped>
  .placeholder {
    color: #999
  }
  
  select.placeholder:focus {
    color: inherit
  }
</style>
