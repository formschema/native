<template>
  <div>
    <h1 v-if="schema.title">{{ schema.title }}</h1>
    <div v-if="error" class="uk-alert-danger" uk-alert>
      <a class="uk-alert-close" @click="alertClosed" uk-close></a>
      <h3 v-if="title">{{ title }}</h3>
      <p>{{ error }}</p>
    </div>
    <form v-if="fields.length" ref="__form" class="uk-form-stacked" @submit.stop.prevent="submit">
      <template v-for="field in fields">
        <div class="uk-margin">
          <template v-if="field.type === 'checkbox'">
            <label :title="field.title">
              <v-checkbox v-model="value[field.name]" class="uk-checkbox"
                :id="field.id"
                :ref="field.name"
                :name="field.name"
                :title="field.title"
                :label="field.label"
                :checked="field.checked"
                :disabled="field.disabled"
                :required="field.required"
                :data-class-error="dataClassError"
                @changed="changed"></v-checkbox>
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
                  :data-class-error="dataClassError"
                  @changed="changed"></v-textarea>
              </template>
              <template v-else-if="field.type === 'file'">
                <v-fileinput v-model="value[field.name]" 
                  :id="field.id" 
                  :ref="field.name"
                  :name="field.name"
                  :placeholder="field.placeholder" 
                  :disabled="field.disabled"
                  :required="field.required"
                  :data-class-error="dataClassError"
                  @change="changed"/>
              </template>
              <template v-else-if="field.type === 'select'">
                <v-select v-model="field[field.name]" 
                  :id="field.id" 
                  :ref="field.name" 
                  :name="field.name" 
                  :options="field.items" 
                  :multiple="field.multiple" 
                  :required="field.required" 
                  :disabled="field.disabled" 
                  :placeholder="field.placeholder" 
                  :data-class-error="dataClassError"
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
                  :data-class-error="dataClassError"
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
  import VFileinput from './fileinput.vue'
  import VCheckbox from './checkbox.vue'

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
      },
      dataClassError: {
        type: String,
        default: 'uk-form-danger'
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
        if (this.$refs.__form.checkValidity()) {
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
        if (!this.$refs[name]) {
          throw new Error(`Undefined input reference '${name}'`)
        }
        return this.$refs[name][0]
      }
    },
    components: {
      VInput, VSelect, VTextarea, VFileinput, VCheckbox
    }
  }
</script>

<style scoped>
  small {
    display: inline-block;
    margin-bottom: 5px
  }
</style>
