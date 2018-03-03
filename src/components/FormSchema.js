import { loadFields } from '@/lib/parser'
import { equals } from '@/lib/object'
import { init, components, set, argName, inputName, initFields } from '@/lib/components'
import FormSchemaField from './FormSchemaField'
import FormSchemaButtons from './FormSchemaButtons'

const fieldTypesAsNotArray = ['radio', 'checkbox', 'textarea', 'select']

init()

export const setComponent = set

export const FormSchema = {
  name: 'form-schema',
  props: {
    /**
     * The JSON Schema object.
     */
    schema: { type: Object, required: true },

    /**
     * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
     * @model
     * @default {}
     */
    value: { type: Object, default: () => ({}) },

    /**
     * The URI of a program that processes the form information.
     */
    action: { type: String },

    /**
     * This property indicates whether the value of the control can be automatically completed by the browser. Possible values are: `off` and `on`.
     */
    autocomplete: { type: String },

    /**
     * When the value of the method attribute is post, enctype is the MIME type of content that is used to submit the form to the server. Possible values are:
     * - application/x-www-form-urlencoded: The default value if the attribute is not specified.
     * - multipart/form-data: The value used for an <input> element with the type attribute set to "file".
     * - text/plain (HTML5)
     */
    enctype: { type: String, default: 'application/x-www-form-urlencoded' },

    /**
     * The HTTP method that the browser uses to submit the form. Possible values are:
     * - post: Corresponds to the HTTP POST method ; form data are included in the body of the form and sent to the server.
     * - get: Corresponds to the HTTP GET method; form data are appended to the action attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.
     */
    method: { type: String, default: 'post' },

    /**
     * This Boolean attribute indicates that the form is not to be validated when submitted.
     */
    novalidate: { type: Boolean }
  },
  data: () => ({
    schemaLoaded: {},
    default: {},
    fields: [],
    error: null,
    data: {},
    inputValues: {}
  }),
  created () {
    this.init(this.schema)
  },
  watch: {
    schema (value, oldValue) {
      if (!equals(value, oldValue)) {
        this.init(value)
      }
    }
  },
  render (createElement) {
    const nodes = []

    if (this.schemaLoaded.title) {
      nodes.push(createElement(
        components.title.component, this.schemaLoaded.title))
    }

    if (this.schemaLoaded.description) {
      nodes.push(createElement(
        components.description.component, this.schemaLoaded.description))
    }

    if (this.error) {
      nodes.push(createElement(components.error.component, this.error))
    }

    const vm = this
    const formNodes = this.fields.map((field) => {
      return createElement(FormSchemaField, {
        props: { field, vm }
      })
    })

    if (formNodes.length) {
      formNodes.push(createElement(FormSchemaButtons, this.$slots.default))

      nodes.push(createElement(components.form.component, {
        ref: '__form',
        [argName(components.form)]: {
          action: this.action,
          enctype: this.enctype,
          method: this.method,
          autocomplete: this.autocomplete,
          novalidate: this.novalidate
        },
        on: {
          reset: this.reset,
          submit: this.submit,
          invalid: this.invalid
        }
      }, formNodes))
    }

    return createElement(components.formwrapper.component, nodes)
  },
  setComponent: setComponent,
  methods: {
    /**
     * @private
     */
    init (schema) {
      this.schemaLoaded = schema || {}

      loadFields(this.schemaLoaded, this.fields)
      initFields(this)
    },

    /**
     * @private
     */
    changed () {
      if (!equals(this.data, this.default)) {
        /**
         * Fired when a change to the element's value is committed by the user.
         */
        this.$emit('change', this.data)
      }
    },

    /**
     * Get the form reference.
     */
    form () {
      return this.$refs.__form
    },

    /**
     * Returns true if the element's child controls satisfy their validation constraints. When false is returned, cancelable invalid events are fired for each invalid child and validation problems are reported to the user.
     */
    reportValidity () {
      const controls = this.form().elements
      let validity = true

      for (let i = 0; i < controls.length; i++) {
        if ('checkValidity' in controls[i]) {
          validity = validity && controls[i].checkValidity()
        }
      }

      return validity
    },

    /**
     * Checks whether the form has any constraints and whether it satisfies them. If the form fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns false.
     * @aliasof reportValidity
     */
    checkValidity () {
      return this.reportValidity()
    },

    /**
     * @private
     */
    invalid (e) {
      /**
       * Fired when a submittable element has been checked and doesn't satisfy its constraints. The validity of submittable elements is checked before submitting their owner form, or after the `checkValidity()` of the element or its owner form is called.
       */
      this.$emit('invalid', e)
    },

    /**
     * Reset the value of all elements of the parent form.
     */
    reset () {
      for (let key in this.inputValues) {
        delete this.inputValues[key]
      }

      this.fields.forEach((field) => {
        const attrs = field.attrs

        this.$set(this.data, attrs.name, this.default[attrs.name])

        if (!fieldTypesAsNotArray.includes(attrs.type) && field.schemaType === 'array') {
          this.data[attrs.name].forEach((value, i) => {
            this.inputValues[inputName(field, i)] = value
          })
        }
      })
    },

    /**
     * Send the content of the form to the server.
     */
    submit (event) {
      if (this.checkValidity()) {
        /**
         * Fired when a form is submitted
         */
        this.$emit('submit', event)
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
  }
}

export default FormSchema
