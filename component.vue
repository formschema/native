<script>
  import { clone } from './lib/object'
  import { loadFields } from './lib/parser'

  const components = {
    form: { component: 'form', option: {} },
    file: { component: 'input', option: {} },
    label: { component: 'label', option: {} },
    input: { component: 'input', option: {} },
    radio: { component: 'input', option: {} },
    select: { component: 'select', option: {} },
    option: { component: 'option', option: {} },
    button: {
      component: 'button',
      option: {
        type: 'submit', label: 'Submit'
      }
    },
    checkbox: { component: 'input', option: {} },
    textarea: { component: 'textarea', option: {} }
  }

  const defaultInput = {
    component: 'input',
    option: {}
  }

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

      /**
       * Use this prop to enable inputs wrapping
       */
      itemClass: { type: String },

      dataClassError: { type: String, default: 'form-error' }
    },
    data: () => ({
      default: {},
      fields: [],
      error: null,
      data: {}
    }),
    created () {
      loadFields(this, clone(this.schema))
      this.default = clone(this.value)
      this.data = clone(this.value)
    },
    render (createElement) {
      const nodes = []

      if (this.schema.title) {
        nodes.push(createElement('h1', this.schema.title))
      }

      if (this.schema.description) {
        nodes.push(createElement('p', this.schema.description))
      }

      if (this.error) {
        nodes.push(createElement('div', {
          class: this.dataClassError
        }, [ createElement('p', this.title) ]))
      }

      if (this.fields.length) {
        const label = components.label
        const formNodes = []

        this.fields.forEach((field) => {
          if (!field.hasOwnProperty('data-class-error')) {
            field['data-class-error'] = this.dataClassError
          }

          const { component, option } = components[field.type] || defaultInput
          const isNativeComponent = typeof component === 'string'
          const attrsName = isNativeComponent ? 'attrs' : 'props'
          const children = []

          const input = {
            ref: field.name,
            [attrsName]: { ...field, ...option },
            domProps: {
              value: this.value[field.name]
            },
            on: {
              input: (event) => {
                const value = event.target ? event.target.value : event

                this.$set(this.data, field.name, value)
                this.$emit('input', this.data)
              },
              change: this.changed
            }
          }

          switch (field.type) {
            case 'textarea':
              if (isNativeComponent) {
                input.domProps.innerHTML = this.value[field.name]
              }
              break

            case 'select':
              const optionEntry = components.option
              const optionComponent = optionEntry.component
              const optionOption = optionEntry.option
              const isNativeOption = typeof optionComponent === 'string'
              const attrsOptionName = isNativeOption ? 'attrs' : 'props'

              if (!field.required) {
                children.push(createElement(optionComponent))
              }

              field.options.forEach((option) => {
                children.push(createElement(optionComponent, {
                  [attrsOptionName]: option,
                  domProps: {
                    value: option.value,
                    ...optionOption
                  }
                }, option.label))
              })
              break
          }

          const inputElement = createElement(component, input, children)
          const formControlsNodes = []

          if (field.label) {
            const isNativeLabel = typeof label.component === 'string'
            const attrsLabelName = isNativeLabel ? 'attrs' : 'props'
            const labelOption = {
              [attrsLabelName]: { ...field, ...label.option }
            }
            const labelNodes = []

            if (isNativeLabel) {
              labelNodes.push(createElement('span', {
                attrs: {
                  'data-required-field': field.required ? 'true' : 'false'
                }
              }, field.label))
            }

            labelNodes.push(inputElement)

            if (field.description) {
              labelNodes.push(createElement('br'))
              labelNodes.push(createElement('small', field.description))
            }

            formControlsNodes.push(
              createElement(label.component, labelOption, labelNodes))
          } else {
            formControlsNodes.push(inputElement)

            if (field.description) {
              formControlsNodes.push(createElement('br'))
              formControlsNodes.push(createElement('small', field.description))
            }
          }

          if (this.itemClass) {
            formNodes.push(createElement('div', {
              class: this.itemClass
            }, formControlsNodes))
          } else {
            formControlsNodes.forEach((node) => formNodes.push(node))
          }
        })

        const button = this.$slots.hasOwnProperty('default')
          ? { component: this.$slots.default, option: {} }
          : components.button

        if (button.component instanceof Array) {
          formNodes.push(
            createElement(label.component, button.component))
        } else {
          const isNativeButton = typeof button.component === 'string'
          const attrsButtonName = isNativeButton ? 'attrs' : 'props'
          const buttonElement = createElement(button.component, {
            [attrsButtonName]: button.option
          }, button.option.label)

          const isNativeLabel = typeof label.component === 'string'
          const attrsLabelName = isNativeLabel ? 'attrs' : 'props'
          const labelOption = {
            [attrsLabelName]: label.option
          }

          formNodes.push(
            createElement(label.component, labelOption, [buttonElement]))
        }

        const form = components.form
        const isNativeForm = typeof form.component === 'string'
        const attrsFormName = isNativeForm ? 'attrs' : 'props'
        const formOption = typeof form.option === 'function'
          ? form.option(this)
          : form.option

        nodes.push(createElement(form.component, {
          ref: '__form',
          [attrsFormName]: {
            autocomplete: this.autocomplete,
            novalidate: this.novalidate,
            ...formOption
          },
          on: {
            submit: (event) => {
              event.stopPropagation()
              this.submit(event)
            },
            invalid: this.invalid
          }
        }, formNodes))
      }

      return createElement('div', nodes)
    },
    mounted () {
      this.reset()
    },
    setComponent (type, component, option = {}) {
      components[type] = { component, option }
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
          this.$set(this.data, key, this.default[key])
        }
      },

      /**
       * Send the content of the form to the server
       */
      submit (e) {
        if (this.$refs.__form.checkValidity()) {
          /**
           * Fired when a form is submitted
           */
          this.$emit('submit', e)
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
</script>
