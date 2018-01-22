import { loadFields } from '../lib/parser'
import { equals } from '../lib/object'
import { init, components, set, elementOptions, inputName } from '../lib/components'
import FormSchemaField from './FormSchemaField'
import FormSchemaButtons from './FormSchemaButtons'

const fieldTypesAsNotArray = ['radio', 'checkbox', 'textarea', 'select']

init()

export const setComponent = set

export default {
  name: 'form-schema',
  props: {
    /**
     * The JSON Schema object. Use the `v-if` directive to load asynchronous schema.
     * @type [Object, Promise]
     */
    schema: { type: [Object, Promise], required: true },

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
    novalidate: { type: Boolean },

    /**
     * Define the inputs wrapping class. Leave `undefined` to disable input wrapping.
     */
    inputWrappingClass: { type: String }
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
    if (this.schema instanceof Promise) {
      this.schema.then(this.init)
    } else {
      this.init(this.schema)
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
      const errorOptions = elementOptions(this, components.error)
      const errorNodes = []

      if (components.error.option.native) {
        errorNodes.push(this.error)
      }

      nodes.push(createElement(
        components.error.component, errorOptions, errorNodes))
    }

    const vm = this
    const inputWrappingClass = this.inputWrappingClass
    const formNodes = this.fields.map((field) => {
      return createElement(FormSchemaField, {
        props: { field, vm, inputWrappingClass }
      })
    })

    if (formNodes.length) {
      formNodes.push(createElement(FormSchemaButtons, this.$slots.default))

      const formOptions = elementOptions(this, components.form, {
        action: this.action,
        enctype: this.enctype,
        method: this.method,
        autocomplete: this.autocomplete,
        novalidate: this.novalidate
      })

      nodes.push(createElement(components.form.component, {
        ref: '__form',
        on: {
          reset: this.reset,
          submit: (event) => {
            event.stopPropagation()
            this.submit(event)
          },
          invalid: this.invalid
        },
        ...formOptions
      }, formNodes))
    }

    return createElement('div', nodes)
  },
  setComponent: setComponent,
  methods: {
    /**
      * @private
      */
    init (schema) {
      this.schemaLoaded = schema || {}

      loadFields(this.schemaLoaded, this.fields)

      this.fields.forEach((field) => {
        const attrs = field.attrs

        this.$set(this.data, attrs.name, this.value[attrs.name] || attrs.value)

        if (!fieldTypesAsNotArray.includes(attrs.type) && field.schemaType === 'array') {
          field.isArrayField = true

          if (!Array.isArray(this.data[attrs.name])) {
            this.data[attrs.name] = []
          }

          this.data[attrs.name].forEach((value, i) => {
            this.inputValues[inputName(field, i)] = value
          })

          field.itemsNum = field.minItems
        }
      })

      this.data = Object.seal(this.data)

      if (!equals(this.data, this.value)) {
        /**
         * @private
         */
        this.$emit('input', this.data)
      }

      Object.keys(this.data).forEach((key) => {
        this.default[key] = typeof this.data[key] === 'object' && this.data[key] !== null
          ? Object.freeze(this.data[key])
          : this.data[key]
      })
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
     * Get a form input reference.
     */
    input (name) {
      if (!this.$refs[name]) {
        throw new Error(`Undefined input reference '${name}'`)
      }
      return this.$refs[name][0]
    },

    /**
     * Get the form reference.
     */
    form () {
      return this.$refs.__form
    },

    /**
     * Checks whether the form has any constraints and whether it satisfies them. If the form fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns false.
     */
    checkValidity () {
      return this.$refs.__form.checkValidity()
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
