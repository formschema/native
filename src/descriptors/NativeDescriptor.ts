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
  get<T = DescriptorInstance>(schema: JsonSchema, kind?: FieldKind): T {
    const element = NativeElements.get(kind || schema.type);

    if (Schema.isScalar(schema)) {
      const descriptor: ScalarDescriptor = {
        label: schema.title,
        description: schema.description,
        component: element,
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
        component: element,
        attrs: {},
        props: {},
        items: [],
        addButtonLabel: '+'
      };

      return descriptor as unknown as T;
    }

    const descriptor: ObjectDescriptor = {
      label: schema.title,
      description: schema.description,
      component: element,
      attrs: {},
      props: {},
      order: []
    };

    return descriptor as T;
  }
};
