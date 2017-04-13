<template>
  <div>
    <h1 v-if="schema.title">{{ schema.title }}</h1>
    <div v-if="error" class="uk-alert-danger" uk-alert>
      <a class="uk-alert-close" @click="alertClosed" uk-close></a>
      <h3 v-if="title">{{ title }}</h3>
      <p>{{ error }}</p>
    </div>
    <form v-if="fields.length" ref="form" class="uk-form-stacked" @submit.stop.prevent="submit">
      <template v-for="field in fields">
        <div class="uk-margin">
          <template v-if="field.type === 'checkbox'">
            <label :title="field.title">
              <input v-model="value[field.name]" type="checkbox" class="uk-checkbox"
                :ref="field.name"
                :name="field.name" 
                :title="field.title"
                :required="field.required"
                :disabled="field.disabled" 
                :checked="field.checked"
                @changed="changed">
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
                  :ref="field.name"
                  :name="field.name"
                  :title="field.title"
                  :placeholder="field.placeholder"
                  :rows="field.rows"
                  :minlength="field.minlength"
                  :maxlength="field.maxlength"
                  :disabled="field.disabled" 
                  :required="field.required"
                  @changed="changed"></v-textarea>
              </template>
              <template v-else-if="field.type === 'file'">
                <v-file-input v-model="value[field.name]" 
                  :id="field.id" 
                  :ref="field.name"
                  :name="field.name"
                  :placeholder="field.placeholder" 
                  :disabled="field.disabled"
                  :required="field.required"/>
              </template>
              <template v-else-if="field.type === 'select'">
                <v-select v-model="field[field.name]" class="uk-select" 
                  :id="field.id" 
                  :ref="field.name" 
                  :name="field.name" 
                  :options="field.items" 
                  :multiple="field.multiple" 
                  :required="field.required" 
                  :disabled="field.disabled" 
                  :placeholder="field.placeholder" 
                  @change="changed"></v-select>
              </template>
              <template v-else>
                <v-input v-model="value[field.name]"
                  :id="field.id"
                  :ref="field.name"
                  :type="field.type"
                  :name="field.name"
                  :title="field.title"
                  :placeholder="field.placeholder"
                  :minlength="field.minlength"
                  :maxlength="field.maxlength"
                  :disabled="field.disabled"
                  :required="field.required"
                  :autocomplete="field.autocomplete"
                  @changed="changed"></v-input>
              </template>
            </div>
          </template>
        </div>
      </template>
      <slot>
        <button type="submit" class="uk-button uk-button-default">Submit</button>
      </slot>
    </form>
  </div>
</template>

<script>
  import VInput from './input.vue'
  import VSelect from './select.vue'
  import VTextarea from './textarea.vue'
  import VFileInput from './file-input.vue'

  import { clone } from '../lib/object'
  import { loadFields } from '../lib/parser'

  export default {
    name: 'form-schema',
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
      changed (e) {
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
      },
      input (name) {
        return this.$refs[name]
      }
    },
    components: {
      VInput, VSelect, VTextarea, VFileInput
    }
  }
</script>

<style scoped>
  small {
    display: inline-block;
    margin-bottom: 5px
  }
</style>
