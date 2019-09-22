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

export abstract class ScalarParser <
  TModel,
  TField extends Field<any, any, TModel>
> extends Parser<TModel, TField, ScalarUIDescriptor> {
  static getKind(schema: JsonSchema, parent?: UnknowParser): FieldKind | null {
    if (parent && parent.schema.enum instanceof Array) {
      return 'radio';
    }

    if (schema.const) {
      return 'hidden';
    }

    return null;
  }

  static getType(kind: FieldKind): string | null {
    if (kind === 'radio') {
      return kind;
    }

    return null;
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
}
