import { Parser } from '@/parsers/Parser';
import { AbstractParser } from '@/parsers/AbstractParser';
import { JsonSchema } from '@/types/jsonschema';
import { Objects } from '@/lib/Objects';

import {
  ArrayField,
  ArrayDescriptor,
  AbstractParserOptions,
  AbstractUISchemaDescriptor,
  FieldKind,
  ArrayItemField
} from '@/types';

export class ArrayParser extends AbstractParser<any, ArrayDescriptor, ArrayField> {
  protected readonly items: JsonSchema[] = [];
  protected readonly additionalItems: JsonSchema[] = [];
  protected count: number = 0;

  public get kind(): FieldKind {
    return 'array';
  }

  protected get limit(): number {
    if (this.field.uniqueItems) {
      return this.items.length;
    }

    if (this.count < this.field.minItems || !Array.isArray(this.schema.items)) {
      return this.count;
    }

    return this.count < this.items.length
      ? this.count
      : this.items.length;
  }

  protected getFieldItem(itemSchema: JsonSchema, index: number): ArrayItemField | null {
    const kind: FieldKind | undefined = this.field.uniqueItems ? 'checkbox' : undefined;
    const defaultDescriptor = this.options.descriptorConstructor(itemSchema, kind);

    const itemDescriptor = this.field.descriptor.items
      ? this.field.descriptor.items[index] || defaultDescriptor
      : defaultDescriptor;

    const itemModel = typeof this.model[index] !== 'undefined'
      ? this.model[index]
      : itemSchema.default;

    const options: AbstractParserOptions<unknown, AbstractUISchemaDescriptor> = {
      schema: itemSchema,
      model: itemModel,
      descriptor: itemDescriptor,
      descriptorConstructor: this.options.descriptorConstructor,
      name: this.name,
      $forceUpdate: this.options.$forceUpdate
    };

    const parser: any | null = Parser.get(options, this);

    if (parser) {
      parser.field.index = index;

      if (itemDescriptor.kind === 'checkbox') {
        parser.field.attrs.input.name = `${this.field.attrs.input.name}[]`;
        parser.field.attrs.input.type = 'checkbox';
        parser.field.attrs.input.checked = typeof this.model[index] !== 'undefined'
          && itemSchema.default === this.model[index];
      }

      return parser.field;
    }

    return null;
  }

  protected getFieldIndex(index: number) {
    const itemSchema = this.schema.items instanceof Array || this.field.uniqueItems
      ? this.items[index]
      : this.items[0];

    return this.getFieldItem(itemSchema, index);
  }

  protected generateFields() {
    const limit = this.limit;
    const fields = Array(...Array(limit))
      .map((x, index) => this.getFieldIndex(index))
      .filter((field) => field !== null) as ArrayItemField[];

    if (limit < this.count && this.additionalItems.length) {
      let index = limit;

      do {
        const itemSchema = this.additionalItems[0];
        const additionalField = this.getFieldItem(itemSchema, index);

        if (!additionalField) {
          break;
        }

        fields.push(additionalField);
      } while (++index < this.count)
    }

    if (this.field.maxItems) {
      fields.splice(this.field.maxItems);
    }

    fields.forEach(({ model }, index) => {
      if (index > this.model.length - 1) {
        this.model.push(model);
      }
    });

    return fields;
  }

  public parse() {
    super.parse();

    if (this.schema.items) {
      if (this.schema.items instanceof Array) {
        this.items.push(...this.schema.items);
      } else {
        this.items.push(this.schema.items);
      }
    } else {
      this.items.push({ type: 'string' });
    }

    if (this.schema.additionalItems) {
      const additionalItems = this.schema.additionalItems as JsonSchema;

      if (!Objects.isEmpty(additionalItems)) {
        this.additionalItems.push(additionalItems);
      }
    }

    this.field.maxItems = this.schema.maxItems;
    this.field.minItems = this.field.required
      ? this.schema.minItems || 1
      : this.schema.minItems || 0;

    this.count = this.field.minItems > this.model.length
      ? this.field.minItems
      : this.model.length;

    this.parseUniqueItems();

    this.field.children = this.generateFields();

    Object.defineProperty(this.field, 'count', {
      enumerable: true,
      get: () => {
        return this.count;
      },
      set: (value: number) => {
        if (this.field.maxItems && value > this.field.maxItems) {
          return;
        }

        this.count = value;
        this.field.children = this.generateFields();

        this.options.$forceUpdate();
      }
    });
  }

  protected parseUniqueItems(): void {
    if (this.schema.uniqueItems === true && this.items.length === 1) {
      const itemSchema = this.items[0];

      if (itemSchema.enum instanceof Array) {
        this.field.uniqueItems = true;
        this.field.maxItems = itemSchema.enum.length;
        this.count = this.field.maxItems;

        this.items.splice(0);
        itemSchema.enum.forEach((value) => this.items.push({
          ...itemSchema,
          default: value,
          title: `${value}`
        }));

        this.field.max = this.items.length;
      } else {
        this.field.max = this.field.maxItems || this.items.length;
      }
    } else if (typeof this.schema.maxItems === 'number') {
      this.field.max = this.field.maxItems as number;
    } else if (this.schema.items instanceof Array) {
      this.field.max = this.additionalItems.length === 0
        ? this.items.length
        : -1;
    } else {
      this.field.max = -2;
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

  protected getModelValue(): unknown[] {
    return this.model.filter((item: unknown) => typeof item !== 'undefined');
  }

  protected parseValue(data: unknown[]): unknown[] {
    return data instanceof Array ? data : [];
  }
}
