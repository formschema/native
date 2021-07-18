import { VNode } from 'vue';
import { CreateElement } from 'vue/types/umd';
import { UniqueId as UniqueIdLib } from '@/lib/UniqueId';
import { Objects as ObjectsLib } from '@/lib/Objects';
import { Components as ComponentsLib } from '@/lib/Components';
import { Fieldset as FieldsetLib } from '@/lib/Fieldset';
import { Parser as ParserLib } from '@/parsers/Parser';
import { NativeElements as NativeElementsLib } from '@/lib/NativeElements';
import { NativeComponents as NativeComponentsLib } from '@/lib/NativeComponents';
import { UIDescriptor as UIDescriptorLib } from '@/descriptors/UIDescriptor';

import '@/parsers';
import '@/descriptors';

import {
  ComponentOptions,
  RenderContext,
  WatchOptions,
  ComputedOptions
} from 'vue/types/options';

import {
  SubmitEvent,
  ParserOptions,
  UnknowField,
  DescriptorInstance,
  Dict,
  IComponents,
  IParser,
  IUIDescriptor,
  ValidatorFunction
} from '../../types';

import { JsonSchema } from '../../types/jsonschema';

/**
 * FormSchema API
 */
interface FormSchemaVue extends Vue {
  // props
  schema: JsonSchema;
  value?: unknown;
  id: string;
  name?: string;
  bracketedObjectInputName: boolean;
  search: boolean;
  disabled: boolean;
  components: IComponents;
  descriptor: DescriptorInstance | IUIDescriptor;
  validator: ValidatorFunction;

  // data
  key: string;
  ref: string;
  initialModel: unknown;
  ready: boolean;
  parser: IParser<any, UnknowField> | null;

  // computed
  fieldId: string;
  listeners: Record<string, Function | Function[]>;

  // methods
  clone(value: unknown): unknown;
  form(): HTMLFormElement | VNode | undefined;
  emitInputEvent(value: unknown, field: UnknowField): void;
  update(updatedFields: UnknowField[]): void;
}

interface FormSchemaComponent<V extends FormSchemaVue = FormSchemaVue> extends ComponentOptions<V> {
  computed: Accessors<Dict, V>;
  watch?: Record<string, WatchOptionsWithHandler<V, any> | WatchHandler<V, any> | string>;

  render?(this: V, createElement: CreateElement, hack: RenderContext<Props>): VNode;
  renderError?(this: V, createElement: CreateElement, err: Error): VNode;
  staticRenderFns?: ((this: V, createElement: CreateElement) => VNode)[];

  beforeCreate?(this: V): void;
  created?(this: V): void;
  beforeDestroy?(this: V): void;
  destroyed?(this: V): void;
  beforeMount?(this: V): void;
  mounted?(this: V): void;
  beforeUpdate?(this: V): void;
  updated?(this: V): void;
  activated?(this: V): void;
  deactivated?(this: V): void;
  errorCaptured?(err: Error, vm: Vue, info: string): boolean | void;
  serverPrefetch?(this: V): Promise<void>;
}

type Accessors<T, V> = {
  [K in keyof T]: ((this: V) => T[K]) | ComputedOptions<T[K]>
}

type Props = Record<string, any>;
type WatchHandler<V extends Vue, T> = (this: V, val: T, oldVal: T) => void;

interface WatchOptionsWithHandler<V extends Vue, T> extends WatchOptions {
  handler: WatchHandler<V, T>;
}

export const GLOBAL = {
  Elements: Object.freeze(NativeElementsLib)
};

export const Objects = ObjectsLib;
export const UniqueId = UniqueIdLib;
export const Components = ComponentsLib;
export const Fieldset = FieldsetLib;
export const Parser = ParserLib;
export const UIDescriptor = UIDescriptorLib;
export const NativeComponents = NativeComponentsLib;

/**
 * @slot default - Use default slot to insert custom form buttons
 */
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
    schema: {
      type: Object,
      required: true
    },

    /**
     * Use this directive to create two-way data bindings with the
     * component. It automatically picks the correct way to update the
     * element based on the input type.
     *
     * @type any
     */
    value: {
      type: [ Number, String, Array, Object, Boolean ],
      default: undefined
    },

    /**
     * The id property of the Element interface represents the form's identifier,
     * reflecting the id global attribute.
     *
     * @default Random unique ID
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
     * When set to `true` (default), checkbox inputs and nested object inputs
     * will * automatically include brackets at the end of their names
     * (e.g. `name="grouped-checkbox-fields[]"`).
     * Setting this property to `false`, disables this behaviour.
     */
    bracketedObjectInputName: {
      type: Boolean,
      default: true
    },

    /**
     * Use this prop to enable `search` landmark role to identify a section
     * of the page used to search the page, site, or collection of sites.
     */
    search: {
      type: Boolean,
      default: false
    },

    /**
     * Indicates whether the form elements are disabled or not.
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Use this prop to overwrite the default Native HTML Elements with
     * custom components.
     *
     * @default GLOBAL.Elements
     */
    components: {
      type: Components,
      default: (): Readonly<NativeComponentsLib> => GLOBAL.Elements
    },

    /**
     * UI Schema Descriptor to use for rendering.
     *
     * @type DescriptorInstance
     * @typeref #descriptor-interface
     * @default {}
     */
    descriptor: {
      type: Object,
      default: (): object => ({})
    },

    /**
     * The validator function to use to validate data before to emit the
     * `input` event.
     *
     * @see [Custom Validation API](#custom-validation-api)
     * @kind function
     * @param {GenericField} field - The field that requests validation
     * @param {string} field.id - The input ID attribute value
     * @param {string} field.name - The input name attribute value
     * @param {any} field.value - The input value for validation
     * @param {JsonSchema} field.schema - The JSON Schema object of the input
     * @param {boolean} field.required - Boolean indicating whether or not the field is mandatory
     * @param {boolean} field.hasChildren - Boolean indicating whether or not the field has children
     * @param {any} field.initialValue - The initial input value
     * @param {Message[]} field.messages - The input value for validation
     * @returns {Promise<boolean>} A promise that return `true` if validation success and `false` otherwise
     */
    validator: {
      type: Function,
      default: null
    }
  },
  data: () => ({
    key: undefined,
    ref: UniqueId.get('formschema'),
    initialModel: undefined,
    ready: false,
    parser: null
  }),
  computed: {
    fieldId(): string {
      return `${this.id}-field`;
    },
    options(): ParserOptions<any, any> {
      return {
        schema: this.schema,
        model: this.initialModel,
        name: this.name,
        id: this.fieldId,
        required: true,
        descriptor: this.descriptor,
        components: this.components,
        bracketedObjectInputName: this.bracketedObjectInputName,
        onChange: this.emitInputEvent,
        validator: this.validator,
        requestRender: this.update
      };
    },
    listeners(): Record<string, Function | Function[]> {
      const on: any = { ...this.$listeners };

      on.reset = on.reset ? [ on.reset ] : [];

      on.reset.unshift(() => {
        if (this.parser) {
          this.parser.field.reset();
        }
      });

      if (on.submit) {
        const onsubmit = on.submit;

        on.submit = (event: SubmitEvent) => {
          if (this.parser) {
            event.field = this.parser.field;
          }

          return onsubmit(event);
        };
      }

      // remove the injected vue's input event
      // to prevent vue errors on the submit event
      delete on.input;

      return on;
    }
  },
  watch: {
    schema: {
      immediate: true,
      handler(): void {
        this.ready = false;
        this.initialModel = Objects.clone(this.value as any);
      }
    },
    options: {
      immediate: true,
      handler(options: ParserOptions<any, any>): void {
        this.parser = Parser.get(options);
      }
    }
  },
  render(createElement): VNode {
    if (this.parser === null || this.ready === false) {
      return null as any; // nothing to render
    }

    const attrs = {
      disabled: this.disabled
    };

    const props = {
      field: this.parser.field
    };

    const element = createElement(props.field.descriptor.component, { attrs, props });
    const nodes = [ element ];

    if (this.$slots.default) {
      nodes.push(...this.$slots.default);
    }

    return createElement(this.components.get('form'), {
      ref: this.ref,
      key: this.key,
      attrs: {
        id: this.id,
        name: this.name,
        role: this.search ? 'search' : undefined
      },
      props: props,
      on: this.listeners
    }, nodes);
  },
  methods: {
    /**
     * Get the HTML form object reference.
     *
     * **Example**
     *
     * ```html
     * <template>
     *   <FormSchema ref="formSchema" :schema="schema"/>
     * </template>
     *
     * <script>
     *   import FormSchema from '@formschema/native'
     *
     *   export default {
     *     components: { FormSchema },
     *     data: () => ({
     *       schema: { type: 'string' }
     *     }),
     *     mounted() {
     *       console.log(this.$refs.formSchema.form())
     *     }
     *   };
     * </script>
     * ```
     *
     * @returns {HTMLFormElement|VNode|undefined} - An `HTMLFormElement` object or a `VNode` object describing the form element object, or `undefined` for input JSON schema object.
     */
    form(): HTMLFormElement | VNode | undefined {
      return this.$refs[this.ref] as any;
    },

    /**
     * @private
     */
    emitInputEvent(value: unknown, field: UnknowField): void {
      if (this.ready && this.validator) {
        this.validator(field).then((result) => {
          if (result) {
            this.ready = true;
          }
        });
      }

      /**
       * Fired synchronously when the value of an element is changed.
       */
      this.$emit('input', value);

      this.$nextTick(() => {
        this.ready = true;
      });
    },

    /**
     * @private
     */
    update([ field ]: UnknowField[]): void {
      this.key = field.key;
    }
  }
};

export default FormSchema;
