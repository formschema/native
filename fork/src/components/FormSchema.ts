import { FormSchemaComponent } from '@/types';
import { UniqueId } from '@/lib/UniqueId';
import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';
import { Components } from '@/lib/Components';
import { NativeElements } from "@/lib/NativeElements";
import { Descriptor } from "@/descriptors/Descriptor";

export const GLOBAL = {
  NativeElements,
  Descriptor
};

const FormSchema: FormSchemaComponent = {
  name: 'FormSchema',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    /**
     * The input JSON Schema object.
     */
    schema: { type: Object, required: true },

    /**
     * Use this directive to create two-way data bindings with the
     * component. It automatically picks the correct way to update the
     * element based on the input type.
     */
    value: {
      type: [ Number, String, Array, Object, Boolean ],
      default: undefined
    },

    /**
     * The id property of the Element interface represents the form's identifier,
     * reflecting the id global attribute.
     */
    id: {
      type: String,
      default: UniqueId.get('form')
    },

    /**
     * The name of the form. It must be unique among the forms in a document.
     */
    name: {
      type: String,
      default: undefined
    },

    /**
     * Use this prop to enable `search` landmark role to identify a section
     * of the page used to search the page, site, or collection of sites.
     */
    search: { type: Boolean, default: false },

    /**
     * Use this prop to overwrite the default Native HTML Elements with
     * custom components.
     */
    components: {
      type: Components,
      default: () => GLOBAL.NativeElements
    },

    /**
     * UI Schema Descriptor to use for rendering.
     *
     * @type {ScalarDescriptor | ObjectDescriptor | ArrayDescriptor | DescriptorConstructor}
     */
    descriptor: {
      type: [ Object, Function ],
      default: () => GLOBAL.Descriptor
    }
  },
  data: () => ({
    ref: UniqueId.get('form-schema'),
    field: null,
    default: {},
    data: undefined
  }),
  watch: {
    schema(value: JsonSchema) {
      this.load(value, this.value, false);
    }
  },
  created() {
    this.load(this.schema, this.value, false);
  },
  render(createElement) {
    if (this.field === null) {
      return null as any; // nothing to render
    }

    console.log(this.field)

    const root = createElement(this.field.component, {
      attrs: this.field.attrs.input,
      props: {
        field: this.field,
        value: this.data,
        components: this.components
      },
      on: {
        // [INPUT_ADDED_EVENT]: () => {
        //   this.$forceUpdate()
        // },
        input: (event: Event) => {
          // this.processFieldEvent(event);
          this.emitInputEvent();
        },
        change: (event: Event) => {
          // this.processFieldEvent(event);

          if (!Objects.equals(this.data, this.default)) {
            /**
             * Fired when a change to the element's value is committed
             * by the user.
             */
            this.$emit('change', this.data);
          }
        }
      }
    });

    const nodes = [ root ];

    if (this.$slots.default) {
      nodes.push(...this.$slots.default);
    }

    this.$nextTick(() => this.$emit('ready'));

    return createElement(this.components.get('form'), {
      ref: this.ref,
      attrs: {
        id: this.id,
        name: this.name,
        role: this.search ? 'search' : undefined,
        'aria-label': this.schema.title
      },
      props: {
        value: this.data,
        components: this.components
      },
      on: {
        reset: this.reset,
        submit: this.submit,
        invalid: this.invalid
      }
    }, nodes);
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
     * @note The default value of `model` is the initial model defined with the
     * `v-model` directive.
     */
    load (schema: JsonSchema, model: any = undefined, reset = true) {
      if (Objects.isEmpty(schema)) {
        this.field = null;
      } else {
        const descriptorConstructor = this.descriptor instanceof Function
          ? this.descriptor
          : GLOBAL.Descriptor.get;

        const descriptor = this.descriptor instanceof Function
          ? this.descriptor(schema)
          : GLOBAL.Descriptor.get(schema);

        const parser = Parser.get({
          schema: this.schema,
          model: typeof model === 'undefined' ? this.value : model,
          name: this.name,
          descriptor: descriptor,
          descriptorConstructor: descriptorConstructor
        });

        this.field = parser.field;
      }

      this.emitInputEvent();

      if (reset) {
        this.$nextTick(() => this.reset());
      }
    },

    /**
     * @private
     */
    emitInputEvent () {
      /**
       * Fired synchronously when the value of an element is changed.
       */
      this.$emit('input', this.data);
    },

    /**
     * Get the HTML form reference.
     *
     * @returns {HTMLFormElement|undefined} - Returns the HTML form element or `undefined` for empty object
     */
    form () {
      return this.$refs[this.ref];
    },

    /**
     * Returns true if the element's child controls satisfy their
     * validation constraints. When false is returned, cancelable invalid
     * events are fired for each invalid child and validation problems
     * are reported to the user.
     */
    reportValidity () {
      const controls: HTMLInputElement[] = this.form().elements as any;
      let validity = true;

      for (let i = 0; i < controls.length; i++) {
        if ('checkValidity' in controls[i]) {
          validity = validity && controls[i].checkValidity();
        }
      }

      return validity;
    },

    /**
     * @private
     */
    invalid (e) {
      /**
       * Fired when a submittable element has been checked and doesn't
       * satisfy its constraints. The validity of submittable elements is
       * checked before submitting their owner form, or after the
       * `checkValidity()` of the element or its owner form is called.
       */
      this.$emit('invalid', e);
    },

    /**
     * Reset the value of all elements of the parent form.
     */
    reset () {
      const form = this.form()

      if (form && 'reset' in form) {
        form.reset();
      }
    },

    /**
     * Send the content of the form to the server.
     * @private
     */
    submit (event) {
      if (this.reportValidity()) {
        /**
         * Fired when a form is submitted
         */
        this.$emit('submit', event);
      } else {
        this.invalid();
      }
    }
  }
};

export default FormSchema;
