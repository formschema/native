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

export interface Dict<T = unknown> extends Record<string, T> {}

export type Scalar = boolean | number | null | string;
export type SchemaType = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
export type ParserKind = SchemaType | 'enum' | 'list' | 'textarea' | 'image' | 'file' | 'password';
export type ScalarKind = 'string' | 'password' | 'number' | 'integer' | 'null' | 'boolean'
| 'hidden' | 'textarea' | 'image' | 'file' | 'radio' | 'checkbox';
export type ItemKind = 'enum' | 'list';
export type FieldKind = SchemaType | ScalarKind | ItemKind;
export type ComponentsType = 'form' | FieldKind;
export type Component = string | VueComponent | AsyncComponent;

export interface Attributes {
  id: string;
  name?: string;
  type?: string;
  readonly?: boolean;
  required: boolean;
  disabled?: boolean;
  'aria-required'?: 'true';
  [key: string]: any;
}

export interface AriaAttributes extends Attributes {
  readonly 'aria-labelledby'?: string;
  readonly 'aria-describedby'?: string;
}

export interface LabelAttributes {
  id?: string;
  for: string;
}

export interface HelperAttributes {
  id?: string;
}

export interface InputAttributes extends Attributes {
  type: string;
  value: string;
}

export interface StateAttributes<Type extends string> extends InputAttributes {
  type: Type | 'radio';
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
  type: 'text' | 'date' | 'datetime-local' | 'email' | 'idn-email' | 'time' | 'url' | 'radio' | 'file';
  minlength?: number;
  maxlength?: number;
  pattern?: string;
  accept?: string;
}

export interface Field<
  TKind extends FieldKind,
  TAttributes extends Attributes = Attributes,
  TModel = any
> {
  id: string;
  key: string;
  kind: TKind;
  name?: string;
  isRoot: boolean;
  schema: JsonSchema;
  required: boolean;
  deep: number;
  parent?: Field<any>;
  root: Field<any>;
  attrs: TAttributes;
  initialValue: TModel;
  value: TModel;
  setValue: (value: TModel, emitChange?: boolean) => void;
  commit: () => void;
  clear: () => void;
  reset: () => void;
  requestRender: () => void;
}

export interface BooleanField extends Field<'boolean', CheckboxAttributes, boolean> {
  toggle: () => void;
}

export type CheckboxField = Field<'checkbox', CheckboxAttributes, unknown>;
export type NumberField = Field<'number', NumberAttributes, number>;
export type NullField = Field<'null', NullAttributes, null>;
export type StringField = Field<'string', StringAttributes, string>;
export type RadioField = Field<'radio', RadioAttributes, string>;
export type InputField = BooleanField | NumberField | NullField | StringField | RadioField;
export type ScalarField = Field<ScalarKind, Attributes, any>;
export type UnknowField = Field<any, Attributes, any>;

export interface EnumField extends Field<'enum', Attributes> {
  children: RadioField[];
}

export interface ArrayItemField extends Field<any, Attributes> {
  buttons: {
    moveUp: ActionButton<ActionMoveTrigger>;
    moveDown: ActionButton<ActionMoveTrigger>;
    delete: ActionButton<ActionDeleteTrigger>;
  };
}

export type ActionPushTrigger = () => void;
export type ActionMoveTrigger = () => ArrayItemField | undefined;
export type ActionDeleteTrigger = () => ArrayItemField | undefined;

export interface ActionButton<T extends Function> {
  readonly disabled: boolean;
  trigger: T;
}

export interface ArrayField extends Field<'array', Attributes, any[]> {
  uniqueItems: boolean;
  children: ArrayItemField[];
  sortable: boolean;
  pushButton: ActionButton<ActionPushTrigger>;
}

export interface ListItemModel {
  value: string;
  selected: boolean;
}

export interface ListField extends Field<'enum', Attributes> {
  items: ListItemModel[];
}

export interface ObjectFieldChild extends Field<any, Attributes> {
  property: string;
}

export interface ObjectField extends Field<'object', Attributes, Dict> {
  children: Dict<ObjectFieldChild>;
}

export interface ParserOptions<
  TModel,
  TField extends Field<any, any, TModel> = UnknowField,
  TDescriptor extends Descriptor = Descriptor
> {
  kind?: FieldKind;
  readonly key?: string;
  readonly schema: JsonSchema;
  readonly model?: TModel;
  readonly name?: string;
  readonly id?: string;
  readonly required?: boolean;
  readonly descriptor?: TDescriptor;
  components?: ComponentsDeclaration;
  readonly bracketedObjectInputName?: boolean;
  onChange?: (value: TModel, field: TField) => void;
  requestRender?: (updatedFields: Field<any, any, TModel>[]) => void;
}

export type UnknowParser = IParser<any>;

export interface IParser<
  TModel,
  TField extends Field<any, Attributes, TModel> = any
> {
  readonly id: string;
  readonly isRoot: boolean;
  readonly options: ParserOptions<TModel, TField>;
  readonly parent?: UnknowParser;
  readonly root: UnknowParser;
  readonly initialValue: TModel | unknown;
  model: TModel;
  rawValue: TModel;
  readonly kind: string;
  readonly field: TField;
  readonly schema: JsonSchema;
  readonly descriptor: IDescriptor;
  parse: () => void;
  reset: () => void;
  clear: () => void;
  isEmpty: (data?: TModel) => boolean;
  requestRender: (fields?: UnknowField[]) => void;
}

export interface DescriptorProperties<TField extends Field<any, any>> {
  readonly field: TField;
  readonly labelAttrs: LabelAttributes;
  readonly helperAttrs: HelperAttributes;
}

export interface IDescriptor<
  T extends Field<any, any> = UnknowField
> extends Required<Descriptor>, DescriptorProperties<T> {}

export interface IScalarDescriptor extends DescriptorProperties<ScalarField>, Required<ScalarDescriptor> {}

export interface IObjectDescriptor extends DescriptorProperties<ObjectField>, Required<ObjectDescriptor> {
  readonly children: IObjectChildDescriptor[];
  readonly childrenGroups: IObjectGroupItem[];
}

export interface IObjectChildDescriptor extends IDescriptor<ObjectFieldChild> {}

export interface IObjectGroupItem {
  id: string;
  label?: string;
  children: IObjectChildDescriptor[];
}

export interface IArrayChildDescriptor extends IDescriptor<ArrayItemField> {
  buttons: ButtonDescriptor<Function>[];
}

export interface IArrayDescriptor extends DescriptorProperties<ArrayField>, Required<ArrayDescriptor> {
  children: IArrayChildDescriptor[];
}

export type IEnumItemDescriptor = IDescriptor<RadioField>;

export interface IItemsUIDescriptor<T extends Field<any, any>, S extends Field<any, any>> extends IDescriptor<T> {
}

export interface IEnumDescriptor extends IItemsUIDescriptor<EnumField, RadioField> {
  readonly children: IEnumItemDescriptor[];
}

export interface IListDescriptor extends IItemsUIDescriptor<ListField, UnknowField> {
  readonly options: ListFieldItemDescriptor[];
}

export interface ListFieldItemDescriptor extends ListItemModel {
  label: string;
}

export type DescriptorInstance = ScalarDescriptor | EnumDescriptor | ListDescriptor | ObjectDescriptor | ArrayDescriptor;

export interface Descriptor<TKind extends FieldKind = FieldKind> {
  kind?: TKind;
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

/**
 * Describe scalar types like: string, password, number, integer,
 * boolean, null, hidden field, textarea element, image and file
 * inputs, radio and checkbox elements
 */
export interface ScalarDescriptor extends Descriptor<ScalarKind> {
}

/**
 * Use to describe grouped object properties
 */
export interface ObjectGroupDescriptor extends Descriptor {
  properties: string[];
}

/**
 * Describe JSON Schema with type `object`
 */
export interface ObjectDescriptor extends Descriptor {
  properties?: {
    [schemaProperty: string]: DescriptorInstance;
  };
  order?: string[];
  groups?: {
    [groupId: string]: ObjectGroupDescriptor;
  };
}

/**
 * Describe JSON Schema with key `enum`
 */
export interface ItemsDescriptor<TKind extends ItemKind> extends Descriptor<TKind> {
  items?: {
    [itemValue: string]: ScalarDescriptor;
  };
}

/**
 * Describe HTML Radio Elements
 */
export interface EnumDescriptor extends ItemsDescriptor<'enum'> {
}

/**
 * Describe HTML Select Element
 */
export interface ListDescriptor extends ItemsDescriptor<'list'> {
}

/**
 * Describe buttons for array schema
 */
export interface ButtonDescriptor<T extends Function> extends ActionButton<T> {
  type: string;
  label: string;
  tooltip?: string;
}

/**
 * Describe JSON Schema with type `array`
 */
export interface ArrayDescriptor extends Descriptor {
  items?: DescriptorInstance[] | DescriptorInstance;
  pushButton: ButtonDescriptor<ActionPushTrigger>;
  buttons: {
    moveUp: ButtonDescriptor<ActionMoveTrigger>;
    moveDown: ButtonDescriptor<ActionMoveTrigger>;
    delete: ButtonDescriptor<ActionDeleteTrigger>;
  };
}

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
  descriptor: DescriptorInstance | IDescriptor;

  // data
  key: string;
  ref: string;
  initialModel: unknown;
  ready: boolean;
  parser: IParser<any, UnknowField> | null;

  // computed
  fieldId: string;
  field: UnknowField | null;
  listeners: Record<string, Function | Function[]>;

  // methods
  clone(value: unknown): unknown;
  form(): HTMLFormElement | VNode | undefined;
  emitInputEvent(value: unknown): void;
  update(updatedFields: UnknowField[]): void;
}

export interface FormSchemaComponent<V extends FormSchemaVue = FormSchemaVue> extends ComponentOptions<V> {
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

export type Accessors<T, V> = {
  [K in keyof T]: ((this: V) => T[K]) | ComputedOptions<T[K]>
}

export type Props = Record<string, unknown>;
export type WatchHandler<V extends Vue, T> = (this: V, val: T, oldVal: T) => void;

export interface WatchOptionsWithHandler<V extends Vue, T> extends WatchOptions {
  handler: WatchHandler<V, T>;
}

export interface ComponentsDeclaration {
  readonly $: Dict<Component>;
  set(kind: ComponentsType, component: Component): void;
  get(kind: ComponentsType): Component;
}

export interface ElementProps<T extends Field<any>, D extends DescriptorInstance> {
  field: T;
  descriptor: D;
}

export type ArrayButtonComponent = FunctionalComponentOptions<ButtonDescriptor<Function>>;
export type ArrayComponent = FunctionalComponentOptions<ElementProps<ArrayField, IArrayDescriptor>>;
export type BooleanComponent = FunctionalComponentOptions<ElementProps<BooleanField, IScalarDescriptor>>;
export type InputComponent = FunctionalComponentOptions<ElementProps<InputField, IScalarDescriptor>>;
export type StateComponent = FunctionalComponentOptions<ElementProps<CheckboxField, IScalarDescriptor>>;
export type FieldComponent = FunctionalComponentOptions<ElementProps<UnknowField, IScalarDescriptor>>;
export type FieldsetComponent = FunctionalComponentOptions<ElementProps<ObjectField, IObjectDescriptor>>;
export type HelperComponent = FunctionalComponentOptions<ElementProps<UnknowField, IDescriptor>>;
export type ListComponent = FunctionalComponentOptions<ElementProps<ListField, IListDescriptor>>;
export type TextareaComponent = FunctionalComponentOptions<ElementProps<StringField, IScalarDescriptor>>;

export interface InputEvent extends Event {
  readonly target: any;
}
