<template>
  <div class="container">
    <FormSchema class="form" ref="formSchema" v-model="model" @submit.prevent>
      <button type="submit">Subscribe</button>
    </FormSchema>
    <pre class="model">{{ model }}</pre>
  </div>
</template>

<script>
  // import FormSchema from '../../..'
  import '../dist/FormSchema.umd.js'

  const FormSchema = window.FormSchema.default

  export default {
    data: () => ({
      schema: Promise.resolve(require('../schema/newsletter')),
      model: {}
    }),
    created () {
      this.schema.then((schema) => this.$refs.formSchema.load(schema))
    },
    methods: {
      reset () {
        this.$refs.formSchema.form().reset()
      }
    },
    components: { FormSchema }
  }
</script>

<style>
  .container {
    text-align: left;
    max-width: 1024px;
    margin: auto;
    display: flex;
  }

  .form, .model {
    padding: 20px;
  }

  .form {
    background-color: #c5cdd6;
  }

  .model {
    margin: 0;
    background-color: #eff0f1;
  }

  h1 {
    font-size: 1.7em;
    text-align: center;
    margin-top: 0;
    margin-bottom: .2em
  }

  h1 + p {
    display: block;
    text-align: center;
    margin-bottom: 1.2em
  }

  small {
    line-height: 20px;
    display: block;
  }

  [data-fs-field] {
    display: flex;
    margin-bottom: 5px;
  }

  label {
    display: block;
    width: 120px;
    text-align: right;
    margin-right: 10px
  }

  [data-fs-field-input] {
  }

  [data-fs-buttons] {
    padding-left: 130px;
  }

  input {
    display: block;
  }
</style>
