import { Schema } from '@/lib/Schema';
import { JsonSchema } from '@/types/jsonschema';
import { NativeElements } from '@/lib/NativeElements';
import { ScalarDescriptor, ObjectDescriptor, FieldKind } from '@/types';

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
