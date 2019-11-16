import { SetParser } from '@/parsers/SetParser';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';
import { Arrays } from '@/lib/Arrays';
import { Value } from '@/lib/Value';
import { ArrayField, ParserOptions, FieldKind, ArrayItemField, UnknowParser, ArrayDescriptor } from '@/types';
import { ArrayUIDescriptor } from '@/descriptors/ArrayUIDescriptor';

export class ArrayParser extends SetParser<any, ArrayField, ArrayDescriptor, ArrayUIDescriptor> {
  readonly items: JsonSchema[] = [];
  additionalItems?: JsonSchema;
  max = -1;
  count = 0;
  radioIndex = 0;
  childrenParsers: UnknowParser[] = [];

  constructor(options: ParserOptions<any, ArrayField, ArrayDescriptor>, parent?: UnknowParser) {
    super('array', options, parent);
  }

  get initialValue(): unknown[] {
    const value = this.options.model || this.schema.default;

    return value instanceof Array ? [ ...value ] : [];
  }

  get limit(): number {
    if (this.field.uniqueItems || this.items.length === 0) {
      return this.items.length;
    }

    if (this.count < this.field.minItems || !Array.isArray(this.schema.items)) {
      return this.count;
    }

    return this.count < this.items.length
      ? this.count
      : this.items.length;
  }

  get children(): ArrayItemField[] {
    const limit = this.limit;
    const fields = Array(...Array(limit))
      .map((x, index) => this.getFieldIndex(index))
      .filter((field) => field !== null) as ArrayItemField[];

    if (limit < this.count && this.additionalItems) {
      let index = limit;

      do {
        const additionalField = this.getFieldItem(this.additionalItems, index);

        if (additionalField === null) {
          break;
        }

        fields.push(additionalField);
      } while (++index < this.count);
    }

    return fields;
  }

  setFieldValue(field: ArrayItemField, value: unknown) {
    // since it's possible to order children fields, the
    // current field's index must be computed each time
    // TODO: an improvement can be done by using a caching index table
    const index = this.childrenParsers.findIndex((parser) => parser.field === field);

    this.setIndexValue(index, value);
  }

  setIndexValue(index: number, value: unknown) {
    this.rawValue[index] = value;

    this.setValue(this.rawValue);
  }

  isEmpty(data: unknown = this.model) {
    return data instanceof Array && data.length === 0;
  }

  clearModel() {
    for (let i = 0; i < this.rawValue.length; i++) {
      this.rawValue[i] = undefined;
    }

    this.model.splice(0);
  }

  setValue(value: unknown[]) {
    this.rawValue = value as any;

    this.model.splice(0);
    this.model.push(...this.parseValue(this.rawValue) as any);
  }

  reset() {
    this.clearModel();
    this.initialValue.forEach((value, index) => this.setIndexValue(index, value));
    this.childrenParsers.forEach((parser) => parser.reset());
  }

  clear() {
    this.clearModel();
    this.childrenParsers.forEach((parser) => parser.clear());
  }

  getFieldItemName(name: string) {
    return this.root.options.bracketedObjectInputName ? `${name}[]` : name;
  }

  getFieldItem(itemSchema: JsonSchema, index: number): ArrayItemField | null {
    const kind: FieldKind | undefined = this.field.uniqueItems
      ? 'boolean'
      : SetParser.kind(itemSchema);

    const itemModel = typeof this.model[index] === 'undefined'
      ? itemSchema.default
      : this.model[index];

    const descriptorItem = this.options.descriptor && this.options.descriptor.items
      ? this.options.descriptor.items instanceof Array
        ? this.options.descriptor.items[index]
        : this.options.descriptor.items
      : { kind };

    const itemName = this.options.name || itemModel;
    const name = kind === 'enum' && this.radioIndex++
      ? `${itemName}-${this.radioIndex}`
      : itemName;

    const parser = SetParser.get({
      kind: kind,
      schema: itemSchema,
      model: itemModel,
      id: `${this.id}-${index}`,
      name: this.getFieldItemName(name),
      descriptor: descriptorItem as any,
      components: this.root.options.components
    }, this);

    if (this.rawValue.length <= index) {
      this.rawValue.push(undefined);
    }

    if (parser) {
      this.childrenParsers.push(parser);

      if (kind === 'boolean') {
        this.parseCheckboxField(parser, itemModel);
      }

      // update the index raw value
      this.rawValue[index] = parser.model;

      // set the onChange option after the parser initialization
      // to prevent first field value emit
      parser.options.onChange = this.field.sortable
        ? (value) => {
          this.setFieldValue(parser.field, value);
          this.commit();
        }
        : (value) => {
          this.setIndexValue(index, value);
          this.commit();
        };

      return parser.field;
    }

    return null;
  }

  getFieldIndex(index: number) {
    const itemSchema = this.schema.items instanceof Array || this.field.uniqueItems
      ? this.items[index]
      : this.items[0];

    return this.getFieldItem(itemSchema, index);
  }

  move(from: number, to: number) {
    const items = this.field.childrenList;

    if (items[from] && items[to]) {
      const movedField = Arrays.swap<ArrayItemField>(items, from, to);

      Arrays.swap(this.rawValue, from, to);

      this.field.setValue(this.rawValue);
      this.parse();

      return movedField;
    }

    return undefined;
  }

  isDisabled([ from, to ]: [ number, number ]) {
    return !this.field.sortable || !this.field.childrenList[from] || !this.field.childrenList[to];
  }

  upIndexes(itemField: ArrayItemField): [ number, number ] {
    const from = Arrays.index(this.field.childrenList, itemField);
    const to = from - 1;

    return [ from, to ];
  }

  downIndexes(itemField: ArrayItemField): [ number, number ] {
    const from = Arrays.index(this.field.childrenList, itemField);
    const to = from + 1;

    return [ from, to ];
  }

  setButtons(itemField: ArrayItemField) {
    itemField.buttons = {
      moveUp: {
        disabled: this.isDisabled(this.upIndexes(itemField)),
        trigger: () => this.move(...this.upIndexes(itemField))
      },
      moveDown: {
        disabled: this.isDisabled(this.downIndexes(itemField)),
        trigger: () => this.move(...this.downIndexes(itemField))
      },
      delete: {
        disabled: !this.field.sortable,
        trigger: () => {
          const index = Arrays.index(this.field.childrenList, itemField);
          const deletedField = this.field.childrenList.splice(index, 1).pop();

          if (deletedField) {
            this.rawValue.splice(index, 1);
            this.field.setValue(this.rawValue);

            this.count--;

            this.requestRender();
          }

          return deletedField;
        }
      }
    };
  }

  setCount(value: number) {
    if (this.field.maxItems && value > this.field.maxItems) {
      return;
    }

    this.count = value;

    this.childrenParsers.splice(0);

    this.field.children = {};
    this.field.childrenList = this.children;

    this.field.childrenList.forEach((item, i) => {
      this.field.children[i] = item;
    });

    // apply array's model
    this.setValue(this.rawValue);

    this.field.childrenList.forEach((itemField) => this.setButtons(itemField));
  }

  parse() {
    this.field.sortable = false;
    this.field.minItems = this.schema.minItems || (this.field.required ? 1 : 0);
    this.field.maxItems = typeof this.schema.maxItems === 'number' && this.schema.maxItems > 0
      ? this.schema.maxItems
      : Number.MAX_SAFE_INTEGER;

    if (this.schema.items) {
      if (this.schema.items instanceof Array) {
        this.items.push(...this.schema.items);

        if (this.schema.additionalItems && !Objects.isEmpty(this.schema.additionalItems)) {
          this.additionalItems = this.schema.additionalItems;
        }
      } else {
        this.items.push(this.schema.items);

        this.field.sortable = true;
      }
    }

    const self = this;
    const resetField = this.field.reset;

    this.field.pushButton = {
      get disabled() {
        return self.count === self.max || self.items.length === 0;
      },
      trigger: () => {
        this.setCount(this.count + 1);
        this.requestRender();
      }
    };

    this.count = this.field.minItems > this.model.length
      ? this.field.minItems
      : this.model.length;

    // force render update for ArrayField
    this.field.reset = () => {
      resetField();
      this.requestRender();
    };

    this.parseUniqueItems();
    this.setCount(this.count);

    this.commit();
    super.parse();
  }

  parseCheckboxField(parser: any, itemModel: unknown) {
    const isChecked = this.initialValue.includes(itemModel);

    parser.field.attrs.type = 'checkbox';

    parser.setValue = (checked: boolean) => {
      parser.rawValue = checked;
      parser.model = checked ? itemModel : undefined;
    };

    parser.setValue(isChecked);
  }

  parseUniqueItems() {
    if (this.schema.uniqueItems === true && this.items.length === 1) {
      const itemSchema = this.items[0];

      if (itemSchema.enum instanceof Array) {
        this.field.uniqueItems = true;
        this.field.maxItems = itemSchema.enum.length;
        this.count = this.field.maxItems;

        this.items.splice(0);
        itemSchema.enum.forEach((value) => this.items.push({
          ...itemSchema,
          enum: undefined,
          default: value,
          title: `${value}`
        }));

        this.max = this.items.length;
      } else {
        this.max = this.schema.maxItems || this.items.length;
      }
    } else if (this.schema.maxItems) {
      this.max = this.field.maxItems;
    } else if (this.schema.items instanceof Array) {
      this.max = this.additionalItems ? -1 : this.items.length;
    } else {
      this.max = -2;
    }

    if (this.field.uniqueItems) {
      const values: unknown[] = [];

      this.items.forEach((itemSchema) => {
        if (this.model.includes(itemSchema.default)) {
          values.push(itemSchema.default);
        } else {
          values.push(undefined);
        }
      });

      this.model.splice(0);
      this.model.push(...values);
    }
  }

  parseValue(data: unknown[]) {
    return Value.array(data);
  }
}

SetParser.register('array', ArrayParser);
