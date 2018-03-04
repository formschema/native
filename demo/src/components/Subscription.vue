<template>
  <div class="form">
    <FormSchema ref="formSchema" :schema="schema" v-model="model" @change="submit">
      <button type="button" @click="submit">Subscribe</button>
    </FormSchema>
  </div>
</template>

<script>
  import FormSchema from '../../..'

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
    components: { FormSchema }
  }
</script>

<style>
  .form {
    text-align: left;
    width: 600px;
    margin: auto;
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
    display: block;
    margin-bottom: 5px
  }
</style>
