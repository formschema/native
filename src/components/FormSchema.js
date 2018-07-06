import {
  genId,
  parseDefaultScalarValue,
  parseEventValue,
  parseDefaultObjectValue,
  loadFields
} from '@/lib/parser'

import { equals, assign, clone, clear, isEmpty } from '@/lib/object'
import { Components as Instance, argName, inputName } from '@/lib/components'
import { INPUT_ADDED_EVENT } from './FormSchemaInput'
import FormSchemaField from './FormSchemaField'

export const Components = Instance

export default {
  name: 'FormSchema',
  props: {
    /**
     * The JSON Schema object.
     *
     * @default {}
     */
    schema: { type: Object, default: () => ({}) },

    /**
     * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
     *
     * @model
     * @default undefined
     */
    value: {
      type: [ Number, String, Array, Object, Boolean ],
      default: undefined
    },

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
     *<br/>
     * - application/x-www-form-urlencoded: The default value if the attribute is not specified.<br/>
     * - multipart/form-data: The value used for an `<input/>` element with the type attribute set to "file".<br/>
     * - text/plain (HTML5)
     */
    enctype: { type: String, default: 'application/x-www-form-urlencoded' },

    /**
     * The HTTP method that the browser uses to submit the form. Possible values are:
     * <br/>
     * - post: Corresponds to the HTTP POST method ; form data are included in the body of the form and sent to the server.<br/>
     * - get: Corresponds to the HTTP GET method; form data are appended to the action attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.
     */
    method: { type: String, default: 'post' },

    /**
     * This Boolean attribute indicates that the form is not to be validated when submitted.
     */
    novalidate: { type: Boolean },

    /**
     * Use this prop to overwrite the default Native HTML Elements for custom components.
     *
     * @default new Components()
     */
    components: {
      type: Components,
      default: () => new Components()
    }
  },
  data: () => ({
    ref: genId('form-schema'),
    isScalarSchema: false,
    loadedSchema: {},
    fields: [],
    default: {},
    error: null,
    data: {},
    inputValues: {},
    ready: false
  }),
  created () {
    if (!isEmpty(this.schema)) {
      this.load(this.schema, this.value, false)
    }
  },
  render (createElement) {
    if (!this.ready || this.fields.length === 0) {
      return null
    }

    const { title, description } = this.loadedSchema
    const components = this.components
    const nodes = []

    if (title) {
      nodes.push(createElement(components.$.title.component, title))
    }

    if (description) {
      nodes.push(createElement(
        components.$.description.component, description))
    }

    if (this.error) {
      nodes.push(createElement(components.$.error.component, this.error))
    }

    const formInputNodes = this.fields.map((field) => {
      const value = this.isScalarSchema
        ? this.data
        : this.data[field.attrs.name]

      return createElement(FormSchemaField, {
        props: { field, value, components },
        on: {
          [INPUT_ADDED_EVENT]: () => {
            this.$forceUpdate()
          },
          input: (event) => {
            const target = event.target
            const data = event.target.value
            const eventInput = { field, data, target }

            if (field.isArrayField) {
              this.parseArrayValue(eventInput)
            } else {
              const parsedValue = parseEventValue(eventInput)

              if (this.isScalarSchema) {
                this.data = parsedValue
              } else {
                this.data[field.attrs.name] = parsedValue
              }
            }

            this.emitInputEvent()
          },
          change: (event) => {
            const target = event.target
            const data = event.target.value
            const eventInput = { field, data, target }

            if (field.isArrayField) {
              this.parseArrayValue(eventInput)
            } else {
              const parsedValue = parseEventValue(eventInput)

              if (this.isScalarSchema) {
                this.data = parsedValue
              } else {
                this.data[field.attrs.name] = parsedValue
              }
            }

            if (!equals(this.data, this.default)) {
              /**
               * Fired when a change to the element's value is committed by the user.
               */
              this.$emit('change', this.data)
            }
          }
        }
      })
    })

    if (this.$slots.default) {
      formInputNodes.push(createElement(
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
    }, formInputNodes))

    return createElement(components.$.formwrapper.component, {
      attrs: {
        id: this.ref
      }
    }, nodes)
  },
  methods: {
    /**
     * Load the given `schema` with initial filled `value`.
     * Use this to load async schema.
     *
     * @param {object} schema - The JSON Schema object to load
     * @param {Number|String|Array|Object|Boolean} model - The initial data for the schema.
     *
     * @note `model` is not a two-way data bindings.
     * To get the form data, use the `v-model` directive.
     *
     * @note The default value of `model` is the initial model defined with the `v-model` directive.
     */
    load (schema, model = this.value, reset = true) {
      this.ready = false

      this.fields.splice(0)

      clear(this.inputValues)
      clear(this.loadedSchema)
      assign(this.loadedSchema, schema)

      loadFields(this.loadedSchema, this.fields, null, model)

      switch (schema.type) {
        case 'array':
        case 'object':
          this.data = parseDefaultObjectValue(schema, this.fields, model)

          this.parseDefaultArrayValue()

          this.default = Object.freeze(clone(this.data))
          this.isScalarSchema = false
          break

        default:
          this.data = parseDefaultScalarValue(schema, this.fields, model)
          this.default = this.data
          this.isScalarSchema = true
          break
      }

      this.emitInputEvent()

      this.ready = true

      if (reset) {
        this.$nextTick(() => this.reset())
      }
    },

    /**
     * @private
     */
    parseDefaultArrayValue () {
      this.fields.forEach((field) => {
        if (field.isArrayField) {
          const { type, name } = field.attrs

          if (this.data[name] instanceof Array) {
            this.data[name] = this.data[name].filter((value, i) => {
              this.inputValues[inputName(field, i)] = value
              return value !== undefined
            })
          }

          field.itemsNum = type === 'checkbox'
            ? field.items.length
            : field.minItems
        }
      })
    },

    /**
     * @private
     */
    emitInputEvent () {
      /**
       * Fired synchronously when the value of an element is changed.
       */
      this.$emit('input', this.data)
    },

    /**
     * @private
     */
    parseArrayValue (event) {
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

        this.inputValues[key] = ['number', 'integer'].includes(event.field.attrs.type)
          ? Number(event.data)
          : event.data

        const values = []

        for (let i = 0; i < event.field.itemsNum; i++) {
          const currentValue = this.inputValues[inputName(event.field, i)]

          if (currentValue != undefined || currentValue.length) {
            values.push(currentValue)
          }
        }

        this.data[event.field.attrs.name] = values
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
      clear(this.inputValues)

      this.fields.forEach((field) => {
        const { name } = field.attrs

        this.$set(this.data, name, this.default[name])

        if (field.isArrayField) {
          this.data[name].forEach((value, i) => {
            this.inputValues[inputName(field, i)] = value
          })
        }
      })

      const form = this.form()

      if ('reset' in form) {
        form.reset()
      }
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
