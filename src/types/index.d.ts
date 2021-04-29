import { VNode } from 'vue/types/vnode';
import { Vue, CreateElement } from 'vue/types/vue';

import {
  Component as VueComponent,
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
export type ComponentsType = 'form' | 'message' | 'button' | 'helper' | FieldKind;
export type Component = string | VueComponent | AsyncComponent;

export interface Attributes {
  id: string;
  name?: string;
  type?: string;
  readonly?: boolean;
  required?: boolean;
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

export enum MessageType {
  Info = 0,
  Success = 1,
  Warining = 2,
  Error = 3
}

export interface Message {
  type?: MessageType;
  text: string;
}

interface GenericField<TModel = any> {
  id: string;
  key: string;
  name?: string;
  isRoot: boolean;
  schema: JsonSchema;
  required: boolean;
  hasChildren: boolean;
  initialValue: TModel;
  value: TModel;
  readonly messages: Required<Message>[];
  clear(): void; // clear field
  reset(): void; // reset initial field value
  addMessage(message: string, type?: MessageType): void;
  clearMessages(recursive?: boolean): void;
}

export interface Field<
  TKind extends FieldKind,
  TDescriptor extends IUIDescriptor = IUIDescriptor,
  TAttributes extends Attributes = Attributes,
  TModel = any
> extends GenericField<TModel> {
  kind: TKind;
  deep: number;
  parent?: Field<any>;
  root: Field<any>;
  attrs: TAttributes;
  descriptor: TDescriptor;
  readonly messages: Required<Message>[];

  // Value
  setValue(value: TModel, emitChange?: boolean): void;
  commit(): void;

  // Rendering
  requestRender(): void;
}

export interface ScalarField<
  TKind extends ScalarKind = ScalarKind,
  TAttributes extends Attributes = Attributes,
  TModel extends Scalar | unknown = unknown
> extends Field<ScalarKind, IScalarDescriptor, Attributes, Scalar> {
  hasChildren: false;
}

export interface BooleanField extends ScalarField<'boolean', CheckboxAttributes, boolean> {
  toggle: () => void;
}

export type CheckboxField = ScalarField<'checkbox', CheckboxAttributes, unknown>;
export type NumberField = ScalarField<'number', NumberAttributes, number>;
export type NullField = ScalarField<'null', NullAttributes, null>;
export type StringField = ScalarField<'string', StringAttributes, string>;
export type RadioField = ScalarField<'radio', RadioAttributes, string>;
export type InputField = BooleanField | NumberField | NullField | StringField | RadioField;
export type UnknowField = Field<any>;

export interface SetField<
  TKind extends FieldKind,
  TSetDescriptor extends ISetDescriptor,
  TModel,
  TChildField extends UnknowField,
  TAttributes extends Attributes = Attributes,
> extends Field<TKind, TSetDescriptor, TAttributes, TModel> {
  hasChildren: true;
  fields: Dict<TChildField>;
  children: TChildField[];

  /**
   * @param {string} path - The path of the requested field.
   *                        It's formated as JavaScript property access
   *                        notation (e.g., ".userProp.addressesProp[1].nameProp")
   */
  getField: (path: string) => UnknowField | null;
}

export type UnknowSetField = SetField<any, ISetDescriptor, unknown, any>;

export interface EnumField extends SetField<'enum', IEnumDescriptor, unknown, RadioField> {
}

export interface ArrayItemField extends Field<any, IArrayDescriptor, Attributes> {
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
  disabled: boolean;
  trigger: T;
}

export interface ArrayField extends SetField<'array', IArrayDescriptor, any[], ArrayItemField> {
  uniqueItems: boolean;
  sortable: boolean;
  pushButton: ActionButton<ActionPushTrigger>;
  minItems: number; // default value: Number.MAX_SAFE_INTEGER
  maxItems: number; // default value: 1 if the field is required, 0 otherwise
  /**
   * Add a new item value and return `true` if succeed, else return `false`
   */
  addItemValue: (itemValue: any) => boolean;
}

export interface ListItemModel {
  value: string;
  selected: boolean;
}

export interface ListField extends Field<'enum', IListDescriptor, Attributes> {
  items: ListItemModel[];
  hasChildren: false;
}

export interface ObjectFieldChild extends Field<any, IObjectDescriptor, Attributes> {
  property: string;
}

export interface ObjectField extends SetField<'object', IObjectDescriptor, Dict, ObjectFieldChild> {
}

export type ValidatorFunction<T = UnknowField> = (field: T) => Promise<boolean>;

export interface ParserOptions<
  TModel,
  TField extends Field<any, any, any> = UnknowField,
  TDescriptor extends DescriptorDefinition = DescriptorDefinition
> {
  kind?: FieldKind;
  readonly key?: string;
  readonly schema: JsonSchema;
  readonly model?: TModel;
  readonly name?: string;
  readonly id?: string;
  readonly required?: boolean;
  readonly descriptor?: TDescriptor;
  components?: IComponents;
  readonly bracketedObjectInputName?: boolean;
  onChange?: (value: TModel, field: TField) => void;
  validator?: ValidatorFunction<TField>;
  requestRender?: (updatedFields: Field<any, IUIDescriptor, any, TModel>[]) => void;
}

export type UnknowParser = IParser<any>;

export interface IParser<
  TModel,
  TField extends Field<any> = any,
  TDescriptor extends DescriptorDefinition = DescriptorDefinition
> {
  readonly id: string;
  readonly isRoot: boolean;
  readonly options: ParserOptions<TModel, TField, TDescriptor>;
  readonly parent?: UnknowParser;
  readonly root: UnknowParser;
  readonly initialValue: TModel | unknown;
  model: TModel;
  rawValue: TModel;
  readonly kind: string;
  readonly field: TField;
  readonly schema: JsonSchema;
  parse: () => void;
  reset: () => void;
  clear: () => void;
  isEmpty: (data?: TModel) => boolean;
  requestRender: (fields?: UnknowField[]) => void;
}

export interface ISetParser<
  TModel,
  TField extends SetField<any, ISetDescriptor, TModel, UnknowField>,
  TDescriptor extends DescriptorDefinition = DescriptorDefinition
> extends IParser<TModel, TField, TDescriptor> {
}

export interface DescriptorProperties<TDescriptor extends DescriptorDefinition = DescriptorDefinition> {
  readonly labelAttrs: LabelAttributes;
  readonly helperAttrs: HelperAttributes;
  readonly components: IComponents;
  readonly definition: TDescriptor;
}

export interface IUIDescriptor<
  TDescriptor extends DescriptorDefinition = DescriptorDefinition
> extends Required<DescriptorDefinition>, DescriptorProperties<TDescriptor> {
}

export interface IScalarDescriptor extends DescriptorProperties<ScalarDescriptor>, Required<ScalarDescriptor> {}

export interface IObjectDescriptor extends DescriptorProperties<ObjectDescriptor>, Required<ObjectDescriptor> {
  readonly childrenGroups: IObjectGroupItem[];
}

export interface IObjectChildDescriptor extends IUIDescriptor<ObjectFieldChild> {}

export interface IObjectGroupItem {
  id: string;
  label?: string;
  children: ObjectFieldChild[];
}

export interface IArrayChildDescriptor extends IUIDescriptor<ArrayItemField> {
  buttons: ArrayItemButton[];
}

export interface IArrayDescriptor extends DescriptorProperties<ArrayDescriptor>, Required<ArrayDescriptor> {
  readonly children: IArrayChildDescriptor[];
  readonly pushButton: PushButtonDescriptor;
}

export type IEnumItemDescriptor = IUIDescriptor<RadioField>;
export type ISetDescriptor = IEnumDescriptor | IArrayDescriptor | IObjectDescriptor;

export interface IItemsUIDescriptor<
  T extends Field<any, any>,
  S extends Field<any, any>,
  D extends DescriptorDefinition = DescriptorDefinition
> extends IUIDescriptor<D> {}

export interface IEnumDescriptor extends IItemsUIDescriptor<EnumField, RadioField> {
  readonly children: IEnumItemDescriptor[];
}

export interface IListDescriptor extends IItemsUIDescriptor<ListField, UnknowField> {
  readonly options: ListFieldItemDescriptor[];
}

export interface ListFieldItemDescriptor extends ListItemModel {
  label: string;
}

export type SetDescriptor = EnumDescriptor | ArrayDescriptor | ObjectDescriptor;
export type DescriptorInstance = ScalarDescriptor | SetDescriptor | ListDescriptor;

export interface DescriptorDefinition<TKind extends FieldKind = FieldKind> {
  kind?: TKind;
  label?: string;
  helper?: string;
  visible?: boolean; // by default true. If false, component will be ignored on rendering
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
export interface ScalarDescriptor extends DescriptorDefinition<ScalarKind> {
}

/**
 * Use to describe grouped object properties
 */
export interface ObjectGroupDescriptor extends DescriptorDefinition {
  properties: string[];
}

/**
 * Describe JSON Schema with type `object`
 */
export interface ObjectDescriptor extends DescriptorDefinition {
  layout?: Component; // default: 'fieldset'
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
export interface ItemsDescriptor<TKind extends ItemKind> extends DescriptorDefinition<TKind> {
  items?: {
    [itemValue: string]: ScalarDescriptor;
  };
}

/**
 * Describe HTML Radio Elements
 */
export interface EnumDescriptor extends ItemsDescriptor<'enum'> {
  layout?: Component; // default: 'fieldset'
}

/**
 * Describe HTML Select Element
 */
export interface ListDescriptor extends ItemsDescriptor<'list'> {
}

/**
 * Describe buttons for array schema
 */
export interface ButtonDescriptor<T extends string, A extends Function> extends Partial<ActionButton<A>> {
  type: T;
  label: string;
  tooltip?: string;
  visible?: boolean;
  component?: Component;
}

export type PushButtonDescriptor = ButtonDescriptor<'push', ActionPushTrigger>;
export type MoveUpButtonDescriptor = ButtonDescriptor<'moveUp', ActionPushTrigger>;
export type MoveDownButtonDescriptor = ButtonDescriptor<'moveDown', ActionPushTrigger>;
export type DeleteButtonDescriptor = ButtonDescriptor<'delete', ActionPushTrigger>;
export type UnknownButtonDescriptor = ButtonDescriptor<string, ActionPushTrigger>;

export type ArrayItemButton =
  MoveUpButtonDescriptor
  | MoveDownButtonDescriptor
  | DeleteButtonDescriptor
  | UnknownButtonDescriptor;

/**
 * Describe JSON Schema with type `array`
 */
export interface ArrayDescriptor extends DescriptorDefinition {
  layout?: Component; // default: 'fieldset'
  items?: DescriptorInstance[] | DescriptorInstance;
  pushButton: PushButtonDescriptor | null;
  buttons: ArrayItemButton[];
}

/**
 * Custom Components API
 */
export interface IComponents {
  set(kind: ComponentsType, component: Component): void;
  get(kind: ComponentsType, fallbackComponent?: Component): Component;
}

/**
 * FormSchema API
 */
export interface FormSchemaVue extends Vue {
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

export type Props = Record<string, any>;
export type WatchHandler<V extends Vue, T> = (this: V, val: T, oldVal: T) => void;

export interface WatchOptionsWithHandler<V extends Vue, T> extends WatchOptions {
  handler: WatchHandler<V, T>;
}

export interface ElementProps<T extends Field<any>> {
  field: T;
}

export interface SubmitEvent extends Event {
  field: UnknowField;
}

export interface ButtonElementProps extends ElementProps<UnknowField> {
  button: UnknownButtonDescriptor;
}

export interface FunctionalComponentOptions<Props> {
  name: string;
  functional: true;
  render?(this: undefined, createElement: CreateElement, context: RenderContext<Props>): VNode | VNode[];
}

export type ArrayButtonComponent = FunctionalComponentOptions<ButtonElementProps>;
export type MessageComponent = FunctionalComponentOptions<Required<Message>>;
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
