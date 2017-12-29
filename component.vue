<script>
  import { loadFields } from './lib/parser'
  import { equals } from './lib/object'

  const tags = {
    h1: ['title'],
    p: ['description'],
    div: ['error', 'textgroup', 'radiogroup', 'checkboxgroup', 'defaultGroup'],
    form: ['form'],
    input: {
      typed: [
        'checkbox', 'color', 'date', 'datetime', 'datetime-local',
        'email', 'file', 'hidden', 'image', 'month', 'number',
        'password', 'radio', 'range', 'search', 'tel', 'text',
        'time', 'url', 'week'
      ]
    },
    textarea: ['textarea'],
    select: ['select'],
    option: ['option'],
    label: ['label'],
    button: [
      { component: 'button', option: { type: 'submit', label: 'Submit' } },
      { component: 'arraybutton', option: { type: 'button', label: 'Add' } }
    ]
  }

  const option = { native: true }
  const components = {}

  const defineComponent = (tag, item) => {
    if (typeof item === 'object') {
      components[item.component] = {
        component: tag,
        option: { ...option, ...item.option }
      }
    } else {
      components[item] = {
        component: tag,
        option
      }
    }
  }

  for (let tag in tags) {
    if (tags[tag] instanceof Array) {
      tags[tag].forEach((item) => defineComponent(tag, item))
    } else {
      tags[tag].typed.forEach((type) => {
        defineComponent(tag, { component: type, option: { type } })
      })
    }
  }

  const groupedArrayTypes = ['radio', 'checkbox', 'input', 'textarea']
  const fieldTypesAsNotArray = ['radio', 'checkbox', 'textarea', 'select']

  export const inputName = (field, index) => `${field.attrs.name}-${index}`

  export default {
    name: 'form-schema',
    props: {
      /**
       * The JSON Schema object. Use the `v-if` directive to load asynchronous schema.
       */
      schema: { type: [Object, Promise], required: true },

      /**
       * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
       * @model
       * @default {}
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
       * Define the inputs wrapping class. Leave `undefined` to disable input wrapping.
       */
      inputWrappingClass: { type: String }
    },
    data: () => ({
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

      if (this.schema.title) {
        nodes.push(createElement(
          components.title.component, this.schema.title))
      }

      if (this.schema.description) {
        nodes.push(createElement(
          components.description.component, this.schema.description))
      }

      if (this.error) {
        const errorOptions = this.elementOptions(components.error)
        const errorNodes = []

        if (components.error.option.native) {
          errorNodes.push(this.error)
        }

        nodes.push(createElement(
          components.error.component, errorOptions, errorNodes))
      }

      const formNodes = []

      this.fields.forEach((field) => {
        this.renderField(field, formNodes, createElement)
      })

      if (formNodes.length) {
        const buttonWrapper = components.button.option.native
          ? components.defaultGroup : components.label
        const labelOptions = this.elementOptions(buttonWrapper)
        const button = this.$slots.hasOwnProperty('default')
          ? { component: this.$slots.default, option }
          : components.button

        if (button.component instanceof Array) {
          formNodes.push(createElement(
            buttonWrapper.component, labelOptions, button.component))
        } else {
          const buttonOptions = this.elementOptions(button, { type: 'submit' })
          const buttonElement = createElement(
            button.component, buttonOptions, button.option.label)

          formNodes.push(createElement(
            buttonWrapper.component, labelOptions, [buttonElement]))
        }

        const formOptions = this.elementOptions(components.form, {
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
    setComponent (type, component, option = {}) {
      const defaultOption = components[type]
        ? { ...components[type].option }
        : {}

      delete defaultOption.native

      components[type] = { type, component, option, defaultOption }
    },
    methods: {
      /**
       * @private
       */
      init (schema) {
        loadFields(this, { ...schema })

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

        Object.keys(this.data).forEach((key) => {
          this.default[key] = typeof this.data[key] === 'object' && this.data[key] !== null
            ? Object.freeze(this.data[key])
            : this.data[key]
        })
      },

      /**
       * @private
       */
      elementOptions (element, extendingOptions = {}, field = {}, item = {}) {
        if (!field.attrs) {
          field.attrs = {}
        }

        const attrName = element.option.native ? 'attrs' : 'props'
        const elementProps = typeof element.option === 'function'
          ? { ...extendingOptions, ...element.option({ vm: this, field, item }) }
          : { ...element.option, native: undefined, ...extendingOptions }

        return {
          [attrName]: {
            ...element.defaultOption,
            ...elementProps
          }
        }
      },

      /**
       * @private
       */
      renderInputDescription (field, container, createElement) {
        if (field.description) {
          container.push(createElement('br'))
          container.push(createElement('small', field.description))
        }
      },

      /**
       * @private
       */
      renderInput (input, field, element, container, children, createElement) {
        if (field.isArrayField) {
          const attrs = field.attrs

          for (let i = 0; i < field.itemsNum; i++) {
            const name = inputName(field, i)
            const value = this.inputValues[name]
            const propsValue = { name, value }

            container.push(createElement(element.component, {
              ...input,
              ref: name,
              props: propsValue,
              domProps: propsValue,
              on: {
                input: (event) => {
                  this.inputValues[name] = event && event.target
                    ? event.target.value
                    : event

                  const values = []

                  for (let j = 0; j < field.itemsNum; j++) {
                    const currentValue = this.inputValues[inputName(field, j)]

                    if (currentValue) {
                      values.push(currentValue)
                    }
                  }

                  this.data[attrs.name] = values

                  /**
                   * Fired synchronously when the value of an element is changed.
                   */
                  this.$emit('input', this.data)
                },
                change: this.changed
              }
            }, children))
          }

          const labelOptions = this.elementOptions(components.label, {}, field)
          const button = components.arraybutton
          const buttonOptions = {
            ...this.elementOptions(button, {
              disabled: field.maxItems <= field.itemsNum
            }, field),
            on: {
              click: () => {
                if (field.itemsNum < field.maxItems) {
                  field.itemsNum++
                  this.$forceUpdate()
                }
              }
            }
          }
          const label = button.option.label || button.defaultOption.label
          const buttonElement = createElement(
            button.component, buttonOptions, label)

          container.push(createElement(
            components.label.component, labelOptions, [buttonElement]))
        } else {
          container.push(createElement(element.component, input, children))
        }
      },

      /**
       * @private
       */
      renderField (field, formNodes, createElement) {
        const attrs = field.attrs

        if (!attrs.value) {
          attrs.value = this.data[attrs.name]
        }

        const element = field.hasOwnProperty('items') && groupedArrayTypes.includes(attrs.type)
          ? components[`${attrs.type}group`] || components.defaultGroup
          : components[attrs.type] || components.text

        const fieldOptions = this.elementOptions(element, attrs, field)
        const children = []

        const input = {
          ref: attrs.name,
          domProps: {
            value: this.data[attrs.name]
          },
          on: {
            input: (event) => {
              this.data[attrs.name] = event && event.target
                ? event.target.value
                : event

              /**
               * Fired synchronously when the value of an element is changed.
               */
              this.$emit('input', this.data)
            },
            change: this.changed
          },
          ...fieldOptions
        }

        switch (attrs.type) {
          case 'textarea':
            if (element.option.native) {
              input.domProps.innerHTML = this.data[attrs.name]
            }
            break

          case 'radio':
          case 'checkbox':
            if (field.hasOwnProperty('items')) {
              field.items.forEach((item) => {
                const itemOptions = this.elementOptions(
                  components[attrs.type], item, item, item)

                children.push(createElement(
                  components[attrs.type].component, itemOptions, item.label))
              })
            }
            break

          case 'select':
            if (!field.required) {
              children.push(createElement(components.option.component, {
                attrs: { value: '' }
              }))
            }

            field.items.forEach((option) => {
              const optionOptions = this.elementOptions(components.option, {
                value: option.value
              }, field)

              children.push(createElement(components.option.component, {
                domProps: {
                  value: option.value
                },
                ...optionOptions
              }, option.label))
            })
            break
        }

        const formControlsNodes = []

        if (field.label && !option.disableWrappingLabel) {
          const extendingOptions = components.label.native
            ? {}
            : { label: field.label }
          const labelOptions = this.elementOptions(
            components.label, extendingOptions, field)
          const labelNodes = []

          if (components.label.option.native) {
            labelNodes.push(createElement('span', {
              attrs: {
                'data-required-field': field.required ? 'true' : 'false'
              }
            }, field.label))
          }

          this.renderInput(
            input, field, element, labelNodes, children, createElement)

          this.renderInputDescription(field, labelNodes, createElement)

          formControlsNodes.push(createElement(
            components.label.component, labelOptions, labelNodes))
        } else {
          this.renderInput(
            input, field, element, formControlsNodes, children, createElement)

          this.renderInputDescription(field, formControlsNodes, createElement)
        }

        if (this.inputWrappingClass) {
          formNodes.push(createElement('div', {
            class: this.inputWrappingClass
          }, formControlsNodes))
        } else {
          formControlsNodes.forEach((node) => formNodes.push(node))
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
</script>
