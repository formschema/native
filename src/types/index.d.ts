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

import { JsonSchema } from './jsonschema';

export type Scalar = boolean | number | null | string;
export interface Dictionary<T = unknown> { [key: string]: T }
export type ComponentsType = 'form' | FieldKind;

export interface Attributes {
  id: string;
  name?: string;
  type?: string;
  readonly?: boolean;
  required: boolean;
  disabled?: boolean;
  'aria-required'?: 'true';
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export interface InputAttributes extends Attributes {
  type: string;
  value: string;
}

export interface StateAttributes<Type extends string> extends InputAttributes {
  type: Type;
  checked: boolean;
}

export type RadioAttributes = StateAttributes<'radio'>;
export type CheckboxAttributes = StateAttributes<'checkbox'>;

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

export type SchemaType = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
export type ParserKind = SchemaType | 'enum' | 'list';
export type FieldKind = SchemaType | 'enum' | 'radio' | 'list' | 'textarea' | 'checkbox';
export type Component = string | VueComponent | AsyncComponent;

export interface Field<
  TKind extends FieldKind,
  TAttributes = Attributes,
  TDescriptor = DescriptorInstance,
  TModel = any
> {
  key: string;
  kind: TKind;
  name?: string;
  isRoot: boolean;
  schema: JsonSchema;
  required: boolean;
  deep: number;
  input: {
    attrs: TAttributes;
    props: Dictionary;
    value: TModel;
    setValue: (value: TModel) => void;
    initialValue: TModel;
    component: Component;
    clear: () => {};
    reset: () => {};
  };
  label: {
    attrs: {
      id?: string;
      for: string;
    };
    value?: string;
  };
  helper: {
    attrs: {
      id?: string;
    };
    value?: string;
  };
  descriptor: TDescriptor;
  parent?: Field<any>;
}

export type BooleanField = Field<'boolean', CheckboxAttributes, ScalarDescriptor, boolean>;
export type CheckboxField = Field<'checkbox', CheckboxAttributes, ScalarDescriptor, unknown>;
export type NumberField = Field<'number', NumberAttributes, ScalarDescriptor, number>;
export type NullField = Field<'null', NullAttributes, ScalarDescriptor, null>;
export type StringField = Field<'string', StringAttributes, ScalarDescriptor, string>;
export type RadioField = Field<'radio', RadioAttributes, ScalarDescriptor, string>;
export type InputField = BooleanField | NumberField | NullField | StringField | RadioField;
export type UnknowField = Field<any, Attributes, DescriptorInstance, any>;

export interface EnumField extends Field<'enum', Attributes, ScalarDescriptor> {
  children: RadioField[];
}

export interface ArrayItemField extends Field<any, Attributes, ScalarDescriptor> {
  buttons: {
    clear: ActionButton<ActionClearTrigger>;
    moveUp: ActionButton<ActionMoveTrigger>;
    moveDown: ActionButton<ActionMoveTrigger>;
    delete: ActionButton<ActionDeleteTrigger>;
  };
}

export type ActionClearTrigger = () => void;
export type ActionPushTrigger = () => void;
export type ActionMoveTrigger = () => ArrayItemField | undefined;
export type ActionDeleteTrigger = () => ArrayItemField | undefined;

export interface ActionButton<T extends Function> {
  readonly type: string;
  readonly label: string;
  readonly tooltip?: string;
  disabled?: boolean;
  readonly trigger: T;
}

export interface ArrayField extends Field<'array', Attributes, ArrayDescriptor, any[]> {
  uniqueItems: boolean;
  children: ArrayItemField[];
  sortable: boolean;
  pushButton: ActionButton<ActionPushTrigger>;
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

export interface ParserOptions<
  TModel,
  TDescriptor extends AbstractUISchemaDescriptor,
  TField extends Field<any, any, DescriptorInstance, any> = UnknowField
> {
  readonly key?: string;
  readonly schema: JsonSchema;
  readonly model?: TModel;
  readonly descriptor?: TDescriptor;
  readonly descriptorConstructor: DescriptorConstructor;
  readonly bracketedObjectInputName?: boolean;
  readonly name?: string;
  readonly id?: string;
  readonly required?: boolean;
  onChange?: (value: TModel, field: TField) => void;
  requestRender?: (fields: TField[]) => void;
}

export type UnknowParser = IParser<any>;

export interface IParser<
  TModel,
  TField extends Field<any, Attributes, TDescriptor, TModel> = any,
  TDescriptor extends AbstractUISchemaDescriptor = DescriptorInstance,
> {
  readonly isRoot: boolean;
  readonly isEnumItem: boolean;
  readonly options: ParserOptions<TModel, TDescriptor>;
  readonly parent?: UnknowParser;
  readonly root: UnknowParser;
  model: TModel;
  rawValue: TModel;
  readonly kind: string;
  readonly type?: string;
  readonly field: TField;
  readonly descriptor: TDescriptor;
  readonly schema: JsonSchema;
  parse: () => void;
  isEmpty: (data?: TModel) => boolean;
}

export interface AbstractUISchemaDescriptor {
  kind?: FieldKind;
  label?: string;
  helper?: string;
  component?: Component;
  attrs?: {
    [attr: string]: unknown;
  };
  props?: {
    [prop: string]: unknown;
  };
}

export interface ScalarDescriptor extends AbstractUISchemaDescriptor {
  items?: {
    [key: string]: DescriptorInstance;
  };
}

export interface ObjectDescriptor extends AbstractUISchemaDescriptor {
  properties?: {
    [property: string]: DescriptorInstance;
  };
  order?: string[];
}

export interface ButtonDescriptor {
  label: string;
  tooltip?: string;
}

export interface ArrayDescriptor extends AbstractUISchemaDescriptor {
  items?: DescriptorInstance[];
  buttons: {
    push: ButtonDescriptor;
    clear: ButtonDescriptor;
    moveUp: ButtonDescriptor;
    moveDown: ButtonDescriptor;
    delete: ButtonDescriptor;
  };
}

export type DescriptorInstance = ScalarDescriptor | ObjectDescriptor | ArrayDescriptor;
export type DescriptorConstructor = <T = DescriptorInstance>(schema: JsonSchema, kind?: FieldKind) => T;

export interface FormSchemaVue extends Vue {
  // props
  schema: JsonSchema;
  value?: unknown;
  id: string;
  name?: string;
  bracketedArrayInputName: boolean;
  search: boolean;
  disabled: boolean;
  components: ComponentsDeclaration;
  descriptor: DescriptorInstance | DescriptorConstructor;

  // data
  key: string;
  ref: string;
  initialModel: unknown;
  ready: boolean;

  // computed
  fieldId: string;
  descriptorConstructor: DescriptorConstructor;
  schemaDescriptor: DescriptorInstance;
  parser: any;
  field: UnknowField | null;
  listeners: Record<string, Function | Function[]>;

  // methods
  clone(value: unknown): unknown;
  form(): HTMLFormElement | VNode | undefined;
  emitInputEvent(value: unknown): void;
  update(updatedFields: UnknowField[]): void;
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
  disabled: boolean;
}

export interface ArrayButtonProps extends ButtonDescriptor {
  type: string;
  disabled: boolean;
  trigger: Function;
}

export type ArrayButtonComponent = FunctionalComponentOptions<ArrayButtonProps>;
export type ArrayComponent = FunctionalComponentOptions<ElementProps<ArrayField>>;
export type BooleanComponent = FunctionalComponentOptions<ElementProps<BooleanField>>;
export type InputComponent = FunctionalComponentOptions<ElementProps<InputField>>;
export type StateComponent = FunctionalComponentOptions<ElementProps<CheckboxField>>;
export type FieldComponent = FunctionalComponentOptions<ElementProps<UnknowField>>;
export type FieldsetComponent = FunctionalComponentOptions<ElementProps<ObjectField>>;
export type HelperComponent = FunctionalComponentOptions<ElementProps<UnknowField>>;
export type ListComponent = FunctionalComponentOptions<ElementProps<ListField>>;
export type TextareaComponent = FunctionalComponentOptions<ElementProps<StringField>>;

export interface InputEvent extends Event {
  readonly target: any;
}
