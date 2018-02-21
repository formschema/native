<template>
  <div class="form">
    <FormSchema ref="formSchema" :schema="schema" v-model="model"/>
  </div>
</template>

<script>
  import FormSchema from '../../..'

  export default {
    data: () => ({
      schema: Promise.resolve(require('../schema/newsletter')),
      model: {}
    }),
    methods: {
      submit (data) {
        console.log(data)
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

  .el-alert {
    margin-bottom: 15px
  }
</style>
