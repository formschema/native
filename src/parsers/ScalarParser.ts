import { Parser } from '@/parsers/Parser';
import { JsonSchema } from '@/types/jsonschema';

import {
  Field,
  FieldKind,
  Attributes,
  ScalarDescriptor,
  ParserOptions,
  UnknowParser
} from '@/types';

export abstract class ScalarParser <
  TModel,
  TField extends Field<any, TAttributes, TModel>,
  TAttributes extends Attributes = Attributes
> extends Parser<TModel, TField, ScalarDescriptor, TAttributes> {
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

  constructor(kind: FieldKind, type: string | undefined, options: ParserOptions<TModel>, parent?: UnknowParser) {
    super(kind, options, parent);

    this.attrs.type = type;
  }
}
