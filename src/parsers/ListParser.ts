import { Parser } from '@/parsers/Parser';
import { ListField, ListItem, ScalarDescriptor, FieldKind } from '@/types';

export class ListParser extends Parser<unknown, ScalarDescriptor, ListField> {
  protected readonly enums: any[] = [];

  public get kind(): FieldKind {
    return 'list';
  }

  public get defaultComponent() {
    return this.descriptor.kind
      ? this.options.descriptorConstructor<ScalarDescriptor>(this.schema, this.descriptor.kind).component
      : this.options.descriptorConstructor(this.schema, 'list').component;
  }

  public get items(): ListItem[] {
    return this.enums.map((item) => ({
      value: item,
      selected: this.model === item,
      label: this.descriptor.labels && this.descriptor.labels.hasOwnProperty(item)
        ? this.descriptor.labels[item]
        : item
    }));
  }

  public parse() {
    if (this.schema.enum instanceof Array) {
      this.enums.push(...this.schema.enum);
    }

    this.field.items = this.items;

    super.parse();
    this.emit();
  }

  protected parseValue(data: any): unknown | undefined {
    return typeof data !== 'undefined' ? data : undefined;
  }
}

Parser.register('list', ListParser);
