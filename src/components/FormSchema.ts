import { FormSchemaComponent, DescriptorConstructor, DescriptorInstance } from '@/types';
import { UniqueId as UniqueIdLib } from '@/lib/UniqueId';
import { Parser } from '@/parsers/Parser';
import { Objects as ObjectsLib } from '@/lib/Objects';
import { Components as ComponentsLib } from '@/lib/Components';
import { NativeElements } from '@/lib/NativeElements';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';
import { AbstractParser } from '@/parsers/AbstractParser';

export const GLOBAL = {
  Elements: NativeElements,
  Descriptor: NativeDescriptor
};

export const Objects = ObjectsLib;
export const UniqueId = UniqueIdLib;
export const Components = ComponentsLib;

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
     * Indicates whether the form elements are disabled or not.
     */
    disabled: { type: Boolean, default: false },

    /**
     * Use this prop to overwrite the default Native HTML Elements with
     * custom components.
     */
    components: {
      type: Components,
      default: () => GLOBAL.Elements
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
    default: undefined,
    data: {}
  }),
  computed: {
    descriptorConstructor(): DescriptorConstructor {
      return this.descriptor instanceof Function
        ? this.descriptor
        : GLOBAL.Descriptor.get;
    },
    schemaDescriptor(): DescriptorInstance {
      return this.descriptor instanceof Function
        ? this.descriptor(this.schema)
        : this.descriptor || GLOBAL.Descriptor.get(this.schema);
    },
    parser() {
      return Parser.get({
        schema: this.schema,
        model: this.value,
        name: this.name,
        descriptor: this.schemaDescriptor,
        descriptorConstructor: this.descriptorConstructor,
        $vue: this
      });
    },
    field() {
      return this.parser instanceof AbstractParser
        ? this.parser.field
        : null;
    }
  },
  watch: {
    parser() {
      if (this.field) {
        this.$nextTick(() => this.$emit('ready'));
        this.emitInputEvent();
      }
    }
  },
  render(createElement) {
    if (this.field === null) {
      return null as any; // nothing to render
    }

    const root = createElement(this.field.component, {
      attrs: this.field.attrs.input,
      props: {
        field: this.field,
        value: this.data,
        disabled: this.disabled,
        components: this.components
      }
    });

    const nodes = [ root ];

    if (this.$slots.default) {
      nodes.push(...this.$slots.default);
    }

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
        search: this.search,
        disabled: this.disabled,
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
     * @private
     */
    emitInputEvent () {
      if (this.field === null) {
        return;
      }

      /**
       * Fired synchronously when the value of an element is changed.
       */
      this.$emit('input', this.field.model);
    },

    /**
     * Get the HTML form reference.
     *
     * @returns {HTMLFormElement|VNode|undefined} - Returns the HTML form element or `undefined` for empty object
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
      const form = this.form();

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
