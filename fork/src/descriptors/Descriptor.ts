import { Schema } from '@/lib/Schema';
import { JsonSchema } from '@/types/jsonschema';
import { NativeElements } from '@/lib/NativeElements';

import {
  FieldKind,
  ScalarDescriptor,
  ObjectDescriptor,
  ArrayDescriptor
} from '@/types';

export const Descriptor = {
  get<T = ScalarDescriptor | ObjectDescriptor>(schema: JsonSchema, kind?: FieldKind): T {
    const element = NativeElements.get(kind || schema.type);
    const component = element || NativeElements.get(schema.type);

    if (Schema.isScalar(schema)) {
      const descriptor: ScalarDescriptor = {
        label: schema.title,
        description: schema.description,
        component: component,
        attrs: {},
        props: {},
        labels: {}
      };

      return descriptor as T;
    }

    if (schema.type === 'array') {
      const descriptor: ArrayDescriptor = {
        label: schema.title,
        description: schema.description,
        component: component,
        attrs: {},
        props: {},
        items: []
      };

      return descriptor as T;
    }

    const descriptor: ObjectDescriptor = {
      label: schema.title,
      description: schema.description,
      component: component,
      attrs: {},
      props: {},
      order: []
    };

    return descriptor as T;
  }
};
