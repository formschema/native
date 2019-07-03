import { VNode } from 'vue/types/vnode';
import { Vue, CreateElement } from 'vue/types/vue';

import {
  Component as VueComponent,
  FunctionalComponentOptions,
  ComponentOptions,
  RenderContext,
  AsyncComponent,
  WatchOptions,
  ComputedOptions
} from 'vue/types/options';

import { JsonSchema } from '@/types/jsonschema';

export type Scalar = boolean | number | null | string;
export interface Dictionary<T = unknown> { [key: string]: T }
export type ComponentsType = 'form' | FieldKind;

export interface Attributes {
  id: string;
  name?: string;
  readonly: boolean;
  required: boolean;
  disabled?: boolean;
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
export type FieldKind = SchemaType | 'enum' | 'radio' | 'list' | 'textarea' | 'checkbox';
export type Component = string | VueComponent | AsyncComponent;

export interface Field<
  TKind extends FieldKind,
  TAttributes = Attributes,
  TDescriptor = DescriptorInstance,
  TModel = unknown
> {
  kind: TKind;
  name?: string;
  isRoot: boolean;
  required: boolean;
  default?: TModel;
  readonly model: TModel;
  attrs: {
    input: TAttributes;
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
    [prop: string]: unknown;
  };
  descriptor: TDescriptor;
  component: Component;
  parent?: Field<any>;
  setModel(value: TModel): void;
}

export type BooleanField = Field<'boolean', BooleanAttributes, ScalarDescriptor, boolean>;
export type NumberField = Field<'number', NumberAttributes, ScalarDescriptor, number>;
export type NullField = Field<'null', NullAttributes, ScalarDescriptor, null>;
export type StringField = Field<'string', StringAttributes, ScalarDescriptor, string>;
export type RadioField = Field<'radio', RadioAttributes, ScalarDescriptor, string>;
export type InputField = BooleanField | NumberField | NullField | StringField | RadioField;
export type UnknowField = Field<any, Attributes, DescriptorInstance>;

export interface EnumField extends Field<'enum', Attributes, ScalarDescriptor> {
  children: RadioField[];
}

export interface ArrayItemField extends Field<any, Attributes, ArrayDescriptor> {
  readonly index: number;
}

export interface ArrayField extends Field<'array', Attributes, ArrayDescriptor, any[]> {
  minItems: number;
  maxItems?: number;
  uniqueItems: boolean;
  count: number;
  max: number;
  children: ArrayItemField[];
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

export interface ObjectField extends Field<'object', Attributes, ObjectDescriptor, Dictionary> {
  children: ObjectFieldChild[];
  isArrayField?: boolean;
  minItems?: number;
  itemsNum?: number;
  order: string[];
}

export interface AbstractParserOptions<TModel, TDescriptor extends AbstractUISchemaDescriptor> {
  readonly schema: JsonSchema;
  readonly model: TModel;
  readonly descriptor?: TDescriptor;
  readonly descriptorConstructor: DescriptorConstructor;
  readonly name?: string;
  readonly onChange?: (value: TModel) => void;
}

export interface AbstractUISchemaDescriptor {
  kind?: FieldKind;
  label?: string;
  description?: string;
  component?: Component;
  attrs?: {
    [attr: string]: unknown;
  };
  props?: {
    [prop: string]: unknown;
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

export interface FormSchemaVue extends Vue {
  // props
  schema: JsonSchema;
  value?: unknown;
  id: string;
  name?: string;
  search: boolean;
  disabled: boolean;
  components: ComponentsDeclaration;
  descriptor: DescriptorInstance | DescriptorConstructor;

  // data
  ref: string;
  initialModel: unknown;
  ready: boolean;

  // computed
  descriptorConstructor: DescriptorConstructor;
  schemaDescriptor: DescriptorInstance;
  parser: any;
  field: UnknowField | null;

  // methods
  clone(value: unknown): unknown;
  form(): HTMLFormElement | VNode | undefined;
  emitInputEvent(value: unknown): void;
  emitSubmitEvent(e: Event): void;
}

export interface FormSchemaComponent<V extends FormSchemaVue = FormSchemaVue> extends ComponentOptions<V> {
  computed: Accessors<Dictionary, V>;
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

export type Accessors<T, V> = {
  [K in keyof T]: ((this: V) => T[K]) | ComputedOptions<T[K]>
}

export type Props = Record<string, unknown>;
export type WatchHandler<V extends Vue, T> = (this: V, val: T, oldVal: T) => void;

export interface WatchOptionsWithHandler<V extends Vue, T> extends WatchOptions {
  handler: WatchHandler<V, T>;
}

export interface ComponentsDeclaration {
  readonly $: Dictionary<Component>;
  set(kind: ComponentsType, component: Component): void;
  get(kind: ComponentsType): Component;
}

export interface ElementProps<T extends Field<any>> {
  field: T;
  value: unknown;
  disabled: boolean;
  components: ComponentsDeclaration;
}

export type ArrayButtonComponent = FunctionalComponentOptions<ElementProps<ArrayField>>;
export type ArrayComponent = FunctionalComponentOptions<ElementProps<ArrayField>>;
export type BooleanComponent = FunctionalComponentOptions<ElementProps<BooleanField>>;
export type InputComponent = FunctionalComponentOptions<ElementProps<InputField>>;
export type CheckboxComponent = FunctionalComponentOptions<ElementProps<UnknowField>>;
export type FieldComponent = FunctionalComponentOptions<ElementProps<UnknowField>>;
export type FieldsetComponent = FunctionalComponentOptions<ElementProps<ObjectField>>;
export type HelperComponent = FunctionalComponentOptions<ElementProps<UnknowField>>;
export type ListComponent = FunctionalComponentOptions<ElementProps<ListField>>;
export type TextareaComponent = FunctionalComponentOptions<ElementProps<StringField>>;

export interface InputEvent extends Event {
  readonly target: any;
}
