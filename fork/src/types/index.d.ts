import Vue, { Component as VueComponent } from 'vue';
import { JsonSchema } from "@/types/jsonschema";

export type Dictionary<T = any> = { [key: string]: T };

export interface AttrsDeclaration {}

export interface Attributes extends AttrsDeclaration {
  id: string;
  name: string;
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

export interface Field<T extends FieldKind, X = Attributes, Y = DescriptorType> {
  kind: T;
  isRoot: boolean;
  required: boolean;
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

export interface BooleanField extends Field<'boolean', BooleanAttributes, ScalarDescriptor> {}
export interface NumberField extends Field<'number', NumberAttributes, ScalarDescriptor> {}
export interface NullField extends Field<'null', NullAttributes, ScalarDescriptor> {}
export interface StringField extends Field<'string', StringAttributes, ScalarDescriptor> {}
export interface RadioField extends Field<'radio', RadioAttributes, ScalarDescriptor> {}
export interface ItemField extends Field<any, Attributes, DescriptorType> {}

export interface EnumField extends Field<'enum', Attributes, ScalarDescriptor> {
  children: RadioField[];
}

export interface ArrayField extends Field<'array', Attributes, ScalarDescriptor> {
  definedAsObject: boolean;
  items: ItemField[];
  labels: string[];
  additionalItems: ItemField[];
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

export type ObjectFieldChild = Field<any, Attributes, DescriptorType>;
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
    [property: string]: DescriptorType;
  };
  order?: string[];
}

export interface ArrayDescriptor extends AbstractUISchemaDescriptor {
  items?: DescriptorType[];
  addButtonLabel: string;
}

export type DescriptorType = ScalarDescriptor | ObjectDescriptor | ArrayDescriptor;
export type DescriptorConstructor = <T = DescriptorType>(schema: JsonSchema, kind?: FieldKind) => T;

export interface IFormSchema<T> extends Vue {
  // props
  schema: JsonSchema;
  value: any;
  id: string;
  name: string;
  bracketedArrayInputName: boolean;
  search: boolean;
  components: Dictionary;
  descriptor: ScalarDescriptor | ObjectDescriptor | DescriptorConstructor

  // data
  ref: string;
  fields: Field<any>[];
  default: any;
  data: any;
  inputValues: any;
  field: T;
  parser: object | null;

  // methods
  load(schema: JsonSchema, model: any, reset: boolean): void;
  form(): HTMLFormElement;
  emitInputEvent(): void;
  reset(): void;
  reportValidity(): boolean;
  invalid(e?: any): void;
}
