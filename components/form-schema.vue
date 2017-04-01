<template>
  <div>
    <h1 v-if="schema.title">{{ schema.title }}</h1>
    <slot name="subtitle"></slot>
    <div v-if="error" class="uk-alert-danger" uk-alert>
      <a class="uk-alert-close" @click="alertClosed" uk-close></a>
      <h3 v-if="title">{{ title }}</h3>
      <p>{{ error }}</p>
    </div>
    <form v-if="fields.length" ref="form" class="uk-form-stacked" @submit.stop.prevent="submit">
      <template v-for="field in fields">
        <div class="uk-margin">
          <template v-if="field.type === 'checkbox'">
            <label>
              <input v-model="value[field.name]" type="checkbox" class="uk-checkbox"
                :name="field.name" 
                :required="field.required"
                :disabled="field.disabled" 
                :checked="field.checked">
              {{ field.label }}
              <template v-if="field.description">
                <br>
                <small>{{ field.description }}</small>
              </template>
            </label>
          </template>
          <template v-else>
            <label v-if="field.label" :for="field.id" class="uk-form-label">{{ field.label }}</label>
            <small v-if="field.description">{{ field.description }}</small>
            <div class="uk-form-controls">
              <template v-if="field.type === 'textarea'">
                <v-textarea v-model="value[field.name]"
                  :id="field.id"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  :rows="field.rows"
                  :maxlength="field.maxlength"
                  :disabled="field.disabled" 
                  :required="field.required"
                  @keyup="keyup"></v-textarea>
              </template>
              <template v-else-if="field.type === 'file'">
                <v-file-input :id="field.id" :name="field.name"
                  :placeholder="field.placeholder" :disabled="field.disabled"
                  :required="field.required"/>
              </template>
              <template v-else-if="field.type === 'select'">
                <select :id="field.id" :name="field.name" :multiple="field.multiple" class="uk-select">
                  <option></option>
                  <template v-for="item of field.items">
                    <option :value="item.value" :selected="item.value === field.value">
                      {{ item.label }}</option>
                  </template>
                </select>
              </template>
              <template v-else>
                <v-input v-model="value[field.name]"
                  :id="field.id"
                  :type="field.type"
                  :name="field.name"
                  :placeholder="field.placeholder"
                  :minlength="field.minlength"
                  :maxlength="field.maxlength"
                  :disabled="field.disabled"
                  :required="field.required"
                  :autocomplete="field.autocomplete"
                  @keyup="keyup"></v-input>
              </template>
            </div>
          </template>
        </div>
      </template>
      <slot name="buttons">
        <button type="submit" class="uk-button uk-button-default">Submit</button>
      </slot>
    </form>
  </div>
</template>

<script>
  import VInput from './input.vue'
  import VTextarea from './textarea.vue'
  import VFileInput from './file-input.vue'

  import { clone } from '../lib/object'
  import { loadFields } from '../lib/parser'

  export default {
    name: 'v-form',
    props: {
      schema: {
        type: Object,
        required: true
      },
      value: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        default: {},
        fields: [],
        error: null
      }
    },
    created () {
      loadFields(this, clone(this.schema))
      this.default = clone(this.value)
    },
    mounted () {
      this.reset()
    },
    methods: {
      keyup () {
        this.$emit('changed', true)
      },
      submit () {
        if (this.$refs.form.checkValidity()) {
          this.$emit('input', this.value)
          this.$emit('submit')
        }
      },
      reset () {
        for (let key in this.default) {
          this.$set(this.value, key, this.default[key])
        }
      },
      alertClosed () {
        this.error = null
      },
      setErrorMessage (message) {
        this.error = message
      }
    },
    components: {
      VInput, VTextarea, VFileInput
    }
  }
</script>

<style scoped>
  small {
    display: inline-block;
    margin-bottom: 5px
  }
</style>