import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';

import { Pattern } from '@/lib/Pattern';
import { ScalarUIDescriptor } from '@/descriptors/ScalarUIDescriptor';

import {
  FieldKind,
  ScalarField,
  ParserOptions,
  UnknowParser,
  ScalarDescriptor
} from '@/types';

export abstract class ScalarParser <
  TModel,
  TField extends ScalarField
> extends Parser<TModel, TField, ScalarDescriptor, ScalarUIDescriptor> {
  type?: string;

  static getKind(schema: JsonSchema, parent?: UnknowParser): FieldKind | null {
    if (parent && parent.schema.enum instanceof Array) {
      return 'radio';
    }

    return null;
  }

  static getType(kind: FieldKind): string | null {
    switch (kind) {
      case 'radio':
      case 'hidden':
        return kind;

      default:
        return null;
    }
  }

  constructor(
    kind: FieldKind,
    type: string | undefined,
    options: ParserOptions<TModel, TField, ScalarDescriptor>,
    parent?: UnknowParser
  ) {
    super(kind, options, parent);

    this.type = type;
  }

  parseField() {
    super.parseField();

    this.field.hasChildren = false;

    if (this.type) {
      this.field.attrs.type = this.type;
      this.field.attrs.value = this.model;
    }

    if (this.schema.const) {
      this.field.attrs.pattern = Pattern.escape(`${this.schema.const}`);
    }
  }
}
