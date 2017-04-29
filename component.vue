<template>
  <div>
    <h1 v-if="schema.title">{{ schema.title }}</h1>
    <div v-if="error" class="uk-alert-danger" uk-alert>
      <a class="uk-alert-close" @click="clearErrorMessage" uk-close></a>
      <h3 v-if="title">{{ title }}</h3>
      <p>{{ error }}</p>
    </div>
    <form v-if="fields.length" ref="__form" class="uk-form-stacked"
      :autocomplete="autocomplete"
      :novalidate="novalidate"
      @submit.stop.prevent="submit"
      @invalid="invalid">
      <template v-for="field in fields">
        <div class="uk-margin">
          <template v-if="field.type === 'checkbox'">
            <label :title="field.title">
              <vx-checkbox v-model="value[field.name]" class="uk-checkbox"
                :id="field.id"
                :ref="field.name"
                :name="field.name"
                :title="field.title"
                :label="field.label"
                :checked="field.checked"
                :disabled="field.disabled"
                :required="field.required"
                :data-class-error="dataClassError"
                @change="changed"></vx-checkbox>
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
                <vx-textarea v-model="value[field.name]"
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
                  @change="changed"></vx-textarea>
              </template>
              <template v-else-if="field.type === 'file'">
                <vx-fileinput v-model="value[field.name]" 
                  :id="field.id" 
                  :ref="field.name"
                  :name="field.name"
                  :title="field.title"
                  :placeholder="field.placeholder" 
                  :disabled="field.disabled"
                  :required="field.required"
                  :data-class-error="dataClassError"
                  @change="changed"/>
              </template>
              <template v-else-if="field.type === 'select'">
                <vx-select v-model="value[field.name]" 
                  :id="field.id" 
                  :ref="field.name" 
                  :name="field.name" 
                  :title="field.title"
                  :options="field.items" 
                  :multiple="field.multiple" 
                  :required="field.required" 
                  :disabled="field.disabled" 
                  :placeholder="field.placeholder" 
                  :data-class-error="dataClassError"
                  @change="changed"></vx-select>
              </template>
              <template v-else>
                <vx-input v-model="value[field.name]"
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
                  @change="changed"></vx-input>
              </template>
            </div>
          </template>
        </div>
      </template>
      <!-- Use this slot to override the default form button -->
      <slot>
        <button type="submit" class="uk-button uk-button-default">Submit</button>
      </slot>
    </form>
  </div>
</template>

<script>
  import VxInput from '@vx-components/input'
  import VxSelect from '@vx-components/select'
  import VxTextarea from '@vx-components/textarea'
  import VxFileinput from '@vx-components/fileinput'
  import VxCheckbox from '@vx-components/checkbox'

  import { clone } from './lib/object'
  import { loadFields } from './lib/parser'

  export default {
    name: 'form-schema',
    props: {
      /**
       * The JSON Schema object. Use the `v-if` directive to load asynchronous schema.
       */
      schema: { type: Object, required: true },

      /**
       * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
       * @model
       */
      value: { type: Object, default: () => ({}) },

      /**
       * This property indicates whether the value of the control can be automatically completed by the browser. Possible values are: `off` and `on`.
       */
      autocomplete: { type: String },

      /**
       * This Boolean attribute indicates that the form is not to be validated when submitted.
       */
      novalidate: { type: Boolean },

      dataClassError: { type: String, default: 'uk-form-danger' }
    },
    data: () => ({
      default: {},
      fields: [],
      error: null
    }),
    created () {
      loadFields(this, clone(this.schema))
      this.default = clone(this.value)
    },
    mounted () {
      this.reset()
    },
    methods: {
      /**
       * @private
       */
      changed (e) {
        /**
         * Fired when an form input value is changed.
         */
        this.$emit('change', e)
      },

      /**
       * Get a form input component
       */
      input (name) {
        if (!this.$refs[name]) {
          throw new Error(`Undefined input reference '${name}'`)
        }
        return this.$refs[name][0]
      },

      /**
       * @private
       */
      invalid (e) {
        /**
         * Fired when a submittable element has been checked and doesn't satisfy its constraints. The validity of submittable elements is checked before submitting their owner form.
         */
        this.$emit('invalid', e)
      },

      /**
       * Reset the value of all elements of the parent form.
       */
      reset () {
        for (let key in this.default) {
          this.$set(this.value, key, this.default[key])
        }
      },

      /**
       * Send the content of the form to the server
       */
      submit () {
        if (this.$refs.__form.checkValidity()) {
          /**
           * Fired when a form is submitted
           */
          this.$emit('submit')
        }
      },

      /**
       * Set a message error.
       */
      setErrorMessage (message) {
        this.error = message
      },

      /**
       * clear the message error.
       */
      clearErrorMessage () {
        this.error = null
      }
    },
    components: {
      VxInput, VxSelect, VxTextarea, VxFileinput, VxCheckbox
    }
  }
</script>

<style scoped>
  small {
    display: inline-block;
    margin-bottom: 5px
  }
</style>
