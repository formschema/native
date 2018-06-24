<template>
  <div class="container">
    <FormSchemaNative class="form" ref="formSchema" :schema="schema"
      v-model="model" @change="submit">
      <button type="button" @click="submit">Subscribe</button>
    </FormSchemaNative>
    <pre class="model">{{ model }}</pre>
  </div>
</template>

<script>
  import FormSchemaNative from '../../..'

  export default {
    data: () => ({
      schema: require('../schema/newsletter'),
      model: {}
    }),
    methods: {
      submit (data) {
        console.log(JSON.stringify(this.model, null, 2))
      },
      reset () {
        this.$refs.formSchema.form().reset()
      }
    },
    components: { FormSchemaNative }
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

  label {
    display: flex;
    margin-bottom: 5px
  }

  label span {
    display: block;
    width: 120px;
    text-align: right;
    margin-right: 10px
  }
</style>
