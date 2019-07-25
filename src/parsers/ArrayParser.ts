import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';
import { Arrays } from '@/lib/Arrays';

import {
  ArrayField,
  ArrayDescriptor,
  ParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  ArrayItemField
} from '@/types';

export class ArrayParser extends Parser<any, ArrayField, ArrayDescriptor> {
  readonly items: JsonSchema[] = [];
  additionalItems?: JsonSchema;
  minItems: number = 0;
  maxItems?: number;
  max: number = -1;
  count: number = 0;

  get kind(): FieldKind {
    return 'array';
  }

  get limit(): number {
    if (this.field.uniqueItems || this.items.length === 0) {
      return this.items.length;
    }

    if (this.count < this.minItems || !Array.isArray(this.schema.items)) {
      return this.count;
    }

    return this.count < this.items.length
      ? this.count
      : this.items.length;
  }

  get initialCount() {
    return this.minItems > this.model.length ? this.minItems : this.model.length;
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

  isEmpty(data: unknown = this.model) {
    return data instanceof Array && data.length === 0;
  }

  reset() {
    super.reset();
    this.setCount(this.initialCount);
  }

  clear() {
    this.field.children.forEach(({ input }) => input.clear());
    super.clear();
  }

  getFieldItem(itemSchema: JsonSchema, index: number): ArrayItemField | null {
    const kind: FieldKind | undefined = this.field.uniqueItems ? 'checkbox' : undefined;
    const items = this.field.descriptor.items;

    const itemDescriptor = items && items[index]
      ? items[index]
      : this.options.descriptorConstructor(itemSchema, kind);

    const itemModel = typeof this.model[index] !== 'undefined'
      ? this.model[index]
      : itemSchema.default;

    const name = itemDescriptor.kind === 'enum'
      ? `${this.options.name}-${index}`
      : this.options.name;

    const itemName = this.options.bracketedObjectInputName ? `${name}[]` : name;

    const options: ParserOptions<unknown, AbstractUISchemaDescriptor> = {
      schema: itemSchema,
      model: itemModel,
      descriptor: itemDescriptor,
      descriptorConstructor: this.options.descriptorConstructor,
      bracketedObjectInputName: this.options.bracketedObjectInputName,
      id: `${this.id}-${index}`,
      name: itemName
    };

    if (this.rawValue.length <= index) {
      this.rawValue.push(undefined);
    }

    const parser = Parser.get(options, this);

    if (parser) {
      if (itemDescriptor.kind === 'checkbox') {
        this.parseCheckboxField(parser, itemModel);
      }

      // set the onChange option after the parser initialization
      // to prevent first field value emit
      options.onChange = (value) => {
        // since it's possible to order children fields, the
        // current field's index must be computed each time
        // TODO: an improvement can be done by using a caching index table
        const index = Arrays.index(this.field.children, parser.field);

        this.rawValue[index] = value;

        this.model.splice(0);
        this.model.push(...this.parseValue(this.rawValue) as any);

        this.commit();
      };

      return parser.field as any;
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
    const items = this.field.children;

    if (items[from] && items[to]) {
      Arrays.swap(this.rawValue, from, to);
      this.field.input.setValue(this.rawValue);

      return Arrays.swap<ArrayItemField>(items, from, to);
    }

    return undefined;
  }

  setCount(value: number) {
    if (this.maxItems && value > this.maxItems) {
      return;
    }

    this.count = value;
    this.field.children = this.children;

    // initialize the array model
    if (this.field.uniqueItems) {
      const values = this.field.children.map(({ input }) => input.value);

      this.setValue(values);
    } else {
      this.field.children.forEach(({ input }) => input.setValue(input.value));
    }

    const sortable = this.field.sortable;
    const items = this.field.children;

    const isDisabled = ([ from, to ]: [ number, number ]) => {
      return !sortable || !items[from] || !items[to];
    };

    const upIndexes = (field: ArrayItemField): [ number, number ] => {
      const from = Arrays.index(items, field);
      const to = from - 1;

      return [ from, to ];
    };

    const downIndexes = (field: ArrayItemField): [ number, number ] => {
      const from = Arrays.index(items, field);
      const to = from + 1;

      return [ from, to ];
    };

    const buttons = this.descriptor.buttons;

    items.forEach((field) => {
      field.buttons = {
        clear: {
          ...buttons.clear,
          type: 'clear',
          disabled: false,
          trigger: () => field.input.clear()
        },
        moveUp: {
          // CAUTION: Don't use spread notation here (...buttons.moveUp)
          // to avoid to loose the computed `disabled` behaviour
          type: 'move-up',
          label: buttons.moveUp.label,
          tooltip: buttons.moveUp.tooltip,
          get disabled() {
            return isDisabled(upIndexes(field));
          },
          trigger: () => this.move(...upIndexes(field))
        },
        moveDown: {
          // CAUTION: Don't use spread notation here (...buttons.moveDown)
          // to avoid to loose the computed `disabled` behaviour
          type: 'move-down',
          label: buttons.moveDown.label,
          tooltip: buttons.moveDown.tooltip,
          get disabled() {
            return isDisabled(downIndexes(field));
          },
          trigger: () => this.move(...downIndexes(field))
        },
        delete: {
          ...buttons.delete,
          type: 'delete',
          disabled: !sortable,
          trigger: () => {
            const index = Arrays.index(items, field);

            this.rawValue.splice(index, 1);
            this.field.input.setValue(this.rawValue);

            this.count--;

            return items.splice(index, 1).pop();
          }
        }
      };
    });
  }

  parse() {
    this.field.sortable = false;

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

    this.maxItems = this.schema.maxItems;
    this.minItems = this.schema.minItems || (this.field.required ? 1 : 0);

    const self = this;
    const button = this.descriptor.buttons.push;

    this.field.pushButton = {
      // CAUTION: Don't use spread notation here (...button.push)
      // to avoid to loose the computed `disabled` behaviour
      type: 'push',
      label: button.label,
      tooltip: button.tooltip,
      get disabled() {
        return self.count === self.max || self.items.length === 0;
      },
      trigger: () => {
        this.setCount(this.count + 1);
        this.requestRender();
      }
    };

    this.parseUniqueItems();
    this.setCount(this.initialCount);
    this.commit();
  }

  parseCheckboxField(parser: any, itemModel: unknown) {
    const checked = typeof itemModel !== 'undefined' && this.rawValue.includes(itemModel);

    parser.attrs.type = 'checkbox';

    parser.setValue = (checked: boolean) => {
      parser.rawValue = checked;
      parser.model = checked ? itemModel : undefined;
      parser.attrs.checked = checked;
    };

    parser.setValue(checked);
  }

  parseUniqueItems() {
    if (this.schema.uniqueItems === true && this.items.length === 1) {
      const itemSchema = this.items[0];

      if (itemSchema.enum instanceof Array) {
        this.field.uniqueItems = true;
        this.maxItems = itemSchema.enum.length;
        this.count = this.maxItems;

        this.items.splice(0);
        itemSchema.enum.forEach((value) => this.items.push({
          ...itemSchema,
          enum: undefined,
          default: value,
          title: `${value}`
        }));

        this.max = this.items.length;
      } else {
        this.max = this.maxItems || this.items.length;
      }
    } else if (this.maxItems) {
      this.max = this.maxItems;
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

  parseValue(data: unknown[]): unknown[] {
    return data instanceof Array
      ? data.filter((item) => typeof item !== 'undefined')
      : [];
  }
}

Parser.register('array', ArrayParser);
