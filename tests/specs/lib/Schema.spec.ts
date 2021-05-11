import { Schema } from '@/lib/Schema';
import { JsonSchema } from '@/types/jsonschema';

describe('lib/Schema', () => {
  describe('Schema.isScalar(schema)', () => {
    [ 'boolean', 'integer', 'null', 'number', 'string' ].forEach((type) => {
      const schema = { type } as JsonSchema;

      it(`should validate { type: '${type}' } as scalar schema`, () => {
        expect(Schema.isScalar(schema)).toBeTruthy();
      });
    });

    [ 'array', 'object' ].forEach((type) => {
      const schema = { type } as JsonSchema;

      it(`should validate { type: '${type}' } as non scalar schema`, () => {
        expect(Schema.isScalar(schema)).toBe(false);
      });
    });

    it('should validate empty schema {} as non scalar schema', () => {
      expect(Schema.isScalar({} as any)).toBe(false);
    });
  });
});
