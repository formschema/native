import { genId, loadFields } from '@/lib/parser'
import { equals, merge } from '@/lib/object'
import { Components as Instance, argName, inputName } from '@/lib/components'
import FormSchemaField from './FormSchemaField'

export const Components = Instance

export default {
  name: 'FormSchema',
  props: {
    /**
     * The JSON Schema object.
     */
    schema: { type: Object, default: () => ({}) },

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
     * Use this prop to overwrite the default Native HTML Elements for custom components.
     */
    components: {
      type: Components,
      default: () => new Components()
    }
  },
  data: () => ({
    ref: genId('form-schema'),
    schemaLoaded: { schema: {}, fields: [] },
    default: {},
    error: null,
    data: {},
    inputValues: {}
  }),
  created () {
    this.loadSchema(this.schema)
  },
  render (createElement) {
    const { schema, fields } = this.schemaLoaded
    const components = this.components
    const nodes = []

    if (schema.title) {
      nodes.push(createElement(components.$.title.component, schema.title))
    }

    if (schema.description) {
      nodes.push(createElement(
        components.$.description.component, schema.description))
    }

    if (this.error) {
      nodes.push(createElement(components.$.error.component, this.error))
    }

    const formNodes = fields.map((field) => {
      const value = this.data[field.attrs.name]

      return createElement(FormSchemaField, {
        props: { field, value, components },
        on: {
          input: (event) => {
            const target = event.target
            const data = event.target.value
            const eventInput = { field, data, target }

            if (field.isArrayField) {
              this.onInputArrayValue(eventInput)
            } else {
              this.onInput(eventInput)
            }
          },
          change: (event) => {
            const target = event.target
            const data = event.target.value
            const eventInput = { field, data, target }

            if (field.isArrayField) {
              this.onInputArrayValue(eventInput, false)
            } else {
              this.onInput(eventInput, false)
            }

            this.changed()
          }
        }
      })
    })

    if (formNodes.length) {
      if (this.$slots.default) {
        formNodes.push(createElement(
          components.$.buttonswrapper.component, this.$slots.default))
      }

      nodes.push(createElement(components.$.form.component, {
        ref: this.ref,
        [argName(components.$.form)]: {
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

    return createElement(components.$.formwrapper.component, nodes)
  },
  methods: {
    /**
     * Load the given JSON Schema. Use this to update the initial schema.
     */
    loadSchema (schema) {
      const fields = []

      loadFields(schema, fields)
      this.loadDefaultValues(fields)

      this.schemaLoaded = { schema, fields }
    },

    /**
     * @private
     */
    loadDefaultValues (fields) {
      this.default = {}
      this.inputValues = {}

      fields.forEach((field) => {
        const { type, name } = field.attrs

        this.default[name] = field.schemaType === 'boolean'
          ? typeof this.value[name] === 'boolean'
            ? this.value[name]
            : field.attrs.checked === true
          : this.value[name] || field.attrs.value

        if (field.isArrayField) {
          if (!Array.isArray(this.default[name])) {
            this.default[name] = []
          } else {
            this.default[name] = this.default[name].filter((value, i) => {
              this.inputValues[inputName(field, i)] = value
              return value !== undefined
            })
          }

          field.itemsNum = type === 'checkbox'
            ? field.items.length
            : field.minItems
        }
      })

      const data = {}

      merge(data, this.default)

      this.data = data

      /**
       * Fired synchronously when the value of an element is changed.
       */
      this.$emit('input', this.data)
    },

    /**
     * @private
     */
    onInput (event, triggerInputEvent = true) {
      if (event.field.schemaType === 'boolean') {
        event.data = event.target.checked
      }

      this.data[event.field.attrs.name] = event.data

      if (triggerInputEvent) {
        /**
         * Fired synchronously when the value of an element is changed.
         */
        this.$emit('input', this.data)
      }
    },

    /**
     * @private
     */
    onInputArrayValue (event, triggerInputEvent = true) {
      if (event.field.attrs.type === 'checkbox') {
        if (event.target.checked) {
          if (!this.data[event.field.attrs.name].includes(event.data)) {
            this.data[event.field.attrs.name].push(event.data)
          }
        } else {
          const index = this.data[event.field.attrs.name].indexOf(event.data)

          if (index > -1) {
            this.data[event.field.attrs.name].splice(index, 1)
          }
        }
      } else {
        const index = event.target.getAttribute('data-fs-index')
        const key = inputName(event.field, index)

        this.inputValues[key] = event.data

        const values = []

        for (let i = 0; i < event.field.itemsNum; i++) {
          const currentValue = this.inputValues[inputName(event.field, i)]

          if (currentValue) {
            values.push(currentValue)
          }
        }

        this.data[event.field.attrs.name] = values
      }

      if (triggerInputEvent) {
        /**
         * Fired synchronously when the value of an element is changed.
         */
        this.$emit('input', this.data)
      }
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
     * Get the HTML form reference.
     */
    form () {
      return this.$refs[this.ref]
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

      this.schemaLoaded.fields.forEach((field) => {
        const { name } = field.attrs

        this.$set(this.data, name, this.default[name])

        if (field.isArrayField) {
          this.data[name].forEach((value, i) => {
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
