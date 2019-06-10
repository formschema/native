import { Vue, CreateElement } from 'vue/types/vue';

import {
  Component as VueComponent,
  FunctionalComponentOptions,
  ComponentOptions,
  VNode
} from 'vue';

import { JsonSchema } from "@/types/jsonschema";
import { PropsDefinition, RecordPropsDefinition, RenderContext } from 'vue/types/options';

export type Scalar = boolean | number | null | string;
export type Dictionary<T = any> = { [key: string]: T };
export type ComponentsType = 'form' | FieldKind;

export interface AttrsDeclaration {}

export interface Attributes extends AttrsDeclaration {
  id: string;
  name?: string;
  readonly: boolean;
  required: boolean;
  'aria-required'?: 'true';
  'aria-labelledby'?: string;
}

export interface InputAttributes extends Attributes {
  type: string;
  value: string;
}

export interface BooleanAttributes extends InputAttributes {
  type: 'checkbox';
  checked: boolean;
}

export interface NumberAttributes extends InputAttributes {
  type: 'number' | 'radio';
  min?: number;
  max?: number;
  step?: number;
}

export interface NullAttributes extends InputAttributes {
  type: 'hidden';
  value: '\u0000';
}

export interface StringAttributes extends InputAttributes {
  type: 'text' | 'date' | 'datetime-local' | 'email' | 'idn-email' | 'time' | 'url' | 'radio';
  minlength?: number;
  maxlength?: number;
  pattern?: string;
}

export interface RadioAttributes extends InputAttributes {
  type: 'radio';
  checked: boolean;
}

export type SchemaType = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
export type FieldKind = SchemaType | 'enum' | 'radio' | 'list' | 'textarea';
export type Component = string | VueComponent | Function;

export interface Field<T extends FieldKind, X = Attributes, Y = DescriptorInstance, Z = any> {
  kind: T;
  name?: string;
  isRoot: boolean;
  required: boolean;
  default?: Z;
  model: Z;
  attrs: {
    input: X;
    label: {
      id?: string;
      for: string;
      tabindex?: '-1';
    };
    description: {
      id?: string;
      tabindex?: '-1';
    };
  };
  props: {
    [prop: string]: any;
  };
  descriptor: Y;
  component: Component;
  parent?: Field<any>
}

export interface BooleanField extends Field<'boolean', BooleanAttributes, ScalarDescriptor, boolean> {}
export interface NumberField extends Field<'number', NumberAttributes, ScalarDescriptor, number> {}
export interface NullField extends Field<'null', NullAttributes, ScalarDescriptor, null> {}
export interface StringField extends Field<'string', StringAttributes, ScalarDescriptor, string> {}
export interface RadioField extends Field<'radio', RadioAttributes, ScalarDescriptor, string> {}

export type InputField = BooleanField | NumberField | NullField | StringField | RadioField;
export type UnknowField = Field<any, Attributes, DescriptorInstance>;

export interface EnumField extends Field<'enum', Attributes, ScalarDescriptor> {
  children: RadioField[];
}

export type ArrayItemField = Field<any, Attributes, DescriptorInstance>;

export interface ArrayField extends Field<'array', Attributes, ArrayDescriptor, any[]> {
  definedAsObject: boolean;
  items: ArrayItemField[];
  additionalItems: ArrayItemField[];
  additionalLabels: string[];
  minItems: number;
  maxItems?: number;
  uniqueItems: boolean;
  count: number;
  total: number;
  max: number;
}

export interface ListItem {
  label: string;
  value: string;
  selected: boolean;
}

export interface ListField extends Field<'enum', Attributes, ScalarDescriptor> {
  items: ListItem[];
}

export type ObjectFieldChild = Field<any, Attributes, DescriptorInstance>;

export interface ObjectField extends Field<'object', Attributes, ObjectDescriptor> {
  children: ObjectFieldChild[];
  isArrayField?: boolean;
  minItems?: number;
  itemsNum?: number;
  order: string[];
}

export interface AbstractParserOptions<T, X extends AbstractUISchemaDescriptor> {
  readonly schema: JsonSchema;
  readonly model: T;
  readonly descriptor?: X;
  readonly descriptorConstructor: DescriptorConstructor;
  readonly name?: string;
}

export interface AbstractUISchemaDescriptor {
  kind?: FieldKind;
  label?: string;
  description?: string;
  component?: Component;
  attrs?: {
    [attr: string]: any;
  };
  props?: {
    [prop: string]: any;
  };
}

export interface ScalarDescriptor extends AbstractUISchemaDescriptor {
  labels?: {
    [key: string]: string;
  };
}

export interface ObjectDescriptor extends AbstractUISchemaDescriptor {
  properties?: {
    [property: string]: DescriptorInstance;
  };
  order?: string[];
}

export interface ArrayDescriptor extends AbstractUISchemaDescriptor {
  items?: DescriptorInstance[];
  addButtonLabel: string;
}

export type DescriptorInstance = ScalarDescriptor | ObjectDescriptor | ArrayDescriptor;
export type DescriptorConstructor = <T = DescriptorInstance>(schema: JsonSchema, kind?: FieldKind) => T;

export type FormSchemaData = (this: Vue) => ({
  ref: string;
  field: UnknowField | null;
  default: any;
  data: any;
});

export type FormSchemaComputed = {};

export interface FormSchemaVue extends Vue {
  // props
  schema: JsonSchema;
  value?: any;
  id: string;
  name?: string;
  search: boolean;
  components: any;
  descriptor: DescriptorInstance | DescriptorConstructor;

  // data
  ref: string;
  field: UnknowField | null;
  default: any;
  data: any;

  // methods
  load(schema: JsonSchema, model: any, reset: boolean): void;
  form(): HTMLFormElement;
  emitInputEvent(): void;
  reset(): void;
  reportValidity(): boolean;
  invalid(e?: any): void;
  submit(e?: any): void;
}

export interface FormSchemaMethods {
  load(this: Vue, schema: JsonSchema, model: any, reset: boolean): void;
  form(this: Vue): HTMLFormElement;
  emitInputEvent(this: Vue): void;
  reset(this: Vue): void;
  reportValidity(this: Vue): boolean;
  invalid(this: Vue, e?: any): void;
}

export interface FormSchemaComponent<V extends FormSchemaVue = FormSchemaVue> extends ComponentOptions<V> {
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

export type Props = Record<string, any>;

export type WatchHandler<V extends Vue, T> = (this: V, val: T, oldVal: T) => void;

export interface WatchOptions {
  deep?: boolean;
  immediate?: boolean;
}

export interface WatchOptionsWithHandler<V extends Vue, T> extends WatchOptions {
  handler: WatchHandler<V, T>;
}

interface ElementProps<T> {
  field: T;
}

type ArrayButtonComponent = FunctionalComponentOptions<ElementProps<ArrayField>>;
type ArrayComponent = FunctionalComponentOptions<ElementProps<ArrayField>>;
type InputComponent = FunctionalComponentOptions<ElementProps<InputField>>;
type FieldComponent = FunctionalComponentOptions<ElementProps<UnknowField>>;
type FieldsetComponent = FunctionalComponentOptions<ElementProps<ObjectField>>;
type HelperComponent = FunctionalComponentOptions<ElementProps<UnknowField>>;
type ListComponent = FunctionalComponentOptions<ElementProps<ListField>>;
type TextareaComponent = FunctionalComponentOptions<ElementProps<StringField>>;
