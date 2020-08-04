import { SchemaType } from '@/types';
import { JsonSchema } from '@/types/jsonschema';

const SCALAR_TYPES: SchemaType[] = [
  'boolean',
  'integer',
  'null',
  'number',
  'string'
];

export const Schema = {
  isScalar(schema: JsonSchema): boolean {
    return SCALAR_TYPES.includes(schema.type);
  }
};
