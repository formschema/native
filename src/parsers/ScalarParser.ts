import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';

import { ScalarUIDescriptor } from '@/descriptors/ScalarUIDescriptor';

import {
  Field,
  FieldKind,
  ParserOptions,
  UnknowParser,
  ScalarDescriptor
} from '@/types';
import { Pattern } from '@/lib/Pattern';

export abstract class ScalarParser <
  TModel,
  TField extends Field<any, any, TModel>
> extends Parser<TModel, TField, ScalarUIDescriptor> {
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

    this.field.attrs.type = type;
  }

  parse() {
    if (this.schema.const) {
      this.field.attrs.pattern = Pattern.escape(`${this.schema.const}`);
    }
  }
}
