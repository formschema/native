import { Schema } from '@/lib/Schema';
import { JsonSchema } from '@/types/jsonschema';
import { NativeElements } from '@/lib/NativeElements';

import {
  FieldKind,
  ScalarDescriptor,
  ObjectDescriptor,
  ArrayDescriptor,
  DescriptorInstance
} from '@/types';

export const NativeDescriptor = {
  kind(schema: JsonSchema) {
    return schema.enum
      ? schema.enum.length > 4 ? 'list' : 'enum'
      : schema.type;
  },
  get<T = DescriptorInstance>(schema: JsonSchema, kind?: FieldKind): T {
    const kindUsed = typeof kind === 'undefined'
      ? NativeDescriptor.kind(schema)
      : kind;

    const element = NativeElements.get(kindUsed);

    if (Schema.isScalar(schema)) {
      const descriptor: ScalarDescriptor = {
        kind: kindUsed,
        label: schema.title,
        helper: schema.description,
        component: element,
        attrs: {},
        props: {},
        items: {}
      };

      return descriptor as T;
    }

    if (schema.type === 'array') {
      const descriptor: ArrayDescriptor = {
        kind: kindUsed,
        label: schema.title,
        helper: schema.description,
        component: element,
        attrs: {},
        props: {},
        items: [],
        addButtonLabel: '+'
      };

      return descriptor as unknown as T;
    }

    const descriptor: ObjectDescriptor = {
      kind: kindUsed,
      label: schema.title,
      helper: schema.description,
      component: element,
      attrs: {},
      props: {},
      order: []
    };

    return descriptor as T;
  }
};
