import { UniqueId } from '@/lib/UniqueId';
import { Value } from '@/lib/Value';
import { Objects } from '@/lib/Objects';

import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { JsonSchema } from '../../types/jsonschema';

import {
  ParserOptions,
  Dict,
  ParserKind,
  FieldKind,
  IParser,
  UnknowParser,
  Field,
  UnknowField,
  IUIDescriptor,
  Message,
  DescriptorDefinition
} from '../../types';

const PARSERS: Dict<any> = {};

export abstract class Parser<
  TModel,
  TField extends Field<any, any, any>,
  TDescriptor extends DescriptorDefinition,
  TUIDescriptor extends IUIDescriptor
> implements IParser<TModel, TField, TDescriptor> {
  readonly id: string;
  readonly isRoot: boolean;
  readonly parent?: UnknowParser;
  kind: FieldKind;
  model: TModel;
  rawValue: TModel;
  readonly field: TField;
  readonly options: ParserOptions<TModel, TField, TDescriptor>;
  schema: JsonSchema;

  static register(kind: ParserKind, parserClass: unknown): void {
    PARSERS[kind] = parserClass;
  }

  static kind(schema: JsonSchema): FieldKind {
    return schema.enum
      ? schema.enum.length > 4 ? 'list' : 'enum'
      : schema.type;
  }

  static get(options: ParserOptions<any, any>, parent?: UnknowParser): UnknowParser | null {
    if (typeof options.schema.type === 'undefined') {
      return null;
    }

    if (!PARSERS[options.schema.type]) {
      throw TypeError(`Unsupported schema type: ${JSON.stringify(options.schema.type)}`);
    }

    const kind = options.descriptor && options.descriptor.kind
      ? options.descriptor.kind
      : options.kind;

    const parserKind = kind && PARSERS.hasOwnProperty(kind)
      ? kind
      : Parser.kind(options.schema);

    if (kind) {
      options.kind = kind;
    }

    const parser = new PARSERS[parserKind](options, parent);

    parser.parse();

    return parser;
  }

  constructor(kind: FieldKind, options: ParserOptions<TModel, TField, TDescriptor>, parent?: UnknowParser) {
    this.id = options.id || UniqueId.get(options.name);
    this.parent = parent;
    this.options = options;
    this.isRoot = !parent;
    this.schema = Objects.clone(options.schema);
    this.kind = kind;

    this.rawValue = this.parseValue(this.initialValue) as TModel;
    this.model = this.parseValue(this.initialValue) as TModel;

    const self = this;

    this.field = {
      id: this.id,
      key: UniqueId.get(this.options.id),
      kind: this.kind,
      name: this.options.name,
      isRoot: this.isRoot,
      schema: this.options.schema,
      required: this.options.required || false,
      deep: this.parent ? this.parent.field.deep + 1 : 0,
      attrs: {
        id: this.id,
        type: undefined,
        name: this.options.name,
        readonly: this.schema.readOnly,
        get required() {
          return self.field.required;
        },

        /**
         * Add support with web browsers that don’t communicate the required
         * attribute to assistive technology
         * @see https://www.w3.org/WAI/tutorials/forms/validation/#validating-required-input
         */
        get 'aria-required'() {
          return this.required ? 'true' : undefined;
        }
      },
      get value() {
        return self.model;
      },
      setValue: (value, emitChange = true) => {
        this.setValue(value);

        if (emitChange) {
          this.commit();
        }
      },
      commit: () => this.commit(),
      hasChildren: false,
      initialValue: this.initialValue,
      reset: () => {
        this.reset();
        this.commit();
      },
      clear: () => {
        this.clear();
        this.commit();
      },
      parent: this.parent ? this.parent.field : undefined,
      get root() {
        return self.root.field;
      },
      messages: [] as Required<Message>[],
      requestRender: () => this.requestRender(),
      addMessage(text, type = 3) {
        this.messages.push({ text, type });
      },
      clearMessages() {
        this.messages.splice(0);
      }
    } as TField;
  }

  get root(): UnknowParser {
    return this.parent ? this.parent.root : this;
  }

  get initialValue(): TModel | unknown {
    return typeof this.options.model === 'undefined'
      ? this.schema.const || this.schema.default
      : this.options.model;
  }

  isEmpty(data: unknown = this.model): boolean {
    return typeof data === 'undefined';
  }

  parseValue(data: unknown): unknown {
    return Value.parseValue(data, this.schema);
  }

  setValue(value: unknown): void {
    this.rawValue = value as any;
    this.model = this.parseValue(value) as TModel;
  }

  reset(): void {
    this.setValue(this.parseValue(this.initialValue) as any);
  }

  clear(): void {
    this.setValue(this.parseValue(undefined) as any);
  }

  commit(): void {
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(this.model, this.field);
    }
  }

  requestRender(fields?: UnknowField[]): void {
    if (typeof this.root.options.requestRender === 'function') {
      if (!fields) {
        this.field.key = UniqueId.get(this.options.name);
        fields = [ this.field ];
      }

      this.field.descriptor.update(this.field);
      this.root.options.requestRender(fields);
    }
  }

  abstract parseField(): void;

  parseDescriptor(): void {
    this.field.descriptor = UIDescriptor.get(
      this.options.descriptor || {},
      this.field,
      this.options.components
    ) as TUIDescriptor;

    this.field.descriptor.parse(this.field);
  }

  parse(): void {
    this.parseField();
    this.parseDescriptor();
    this.commit();
  }
}
