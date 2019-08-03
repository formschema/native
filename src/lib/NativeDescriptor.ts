import { Schema } from '@/lib/Schema';
import { JsonSchema } from '@/types/jsonschema';
import { NativeElements } from '@/lib/NativeElements';
import { Components } from '@/lib/Components';

import {
  FieldKind,
  ScalarDescriptor,
  ObjectDescriptor,
  ArrayDescriptor,
  DescriptorInstance,
  DescriptorConstructor
} from '@/types';

export class NativeDescriptor implements DescriptorConstructor {
  readonly components: Components;

  static kind(schema: JsonSchema) {
    return schema.enum
      ? schema.enum.length > 4 ? 'list' : 'enum'
      : schema.type;
  }

  constructor(components: Components = NativeElements) {
    this.components = components;
  }

  get<T = DescriptorInstance>(schema: JsonSchema, kind?: FieldKind): T {
    const kindUsed = typeof kind === 'undefined'
      ? NativeDescriptor.kind(schema)
      : kind;

    const element = this.components.get(kindUsed);

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
        buttons: {
          push: {
            label: '+',
            tooltip: undefined
          },
          clear: {
            label: 'x',
            tooltip: undefined
          },
          moveUp: {
            label: '&#x2191;',
            tooltip: undefined
          },
          moveDown: {
            label: '&#x2193;',
            tooltip: undefined
          },
          delete: {
            label: '-',
            tooltip: undefined
          }
        }
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
      groups: {},
      order: []
    };

    return descriptor as T;
  }
}
