import { NativeDescriptor } from '@/descriptors/NativeDescriptor';
import { DescriptorInstance } from '@/types';
import { JsonSchema } from '@/types/jsonschema';

function ShouldLabelDescription(schema: JsonSchema) {
  const descriptor = NativeDescriptor.get(schema);

  it(`should have label === ${JSON.stringify(schema.title)}`, () => {
    expect(descriptor.label).toEqual(schema.title);
  });

  it(`should have description === ${JSON.stringify(schema.description)}`, () => {
    expect(descriptor.description).toEqual(schema.description);
  });
}

function ShouldHaveCommonProperties(schema: JsonSchema, descriptor: DescriptorInstance) {
  ShouldLabelDescription(schema);

  it('should have component', () => {
    expect(descriptor.component).toBeDefined();
  });

  it('should have attrs', () => {
    expect(descriptor.attrs).toEqual({});
  });

  it('should have props', () => {
    expect(descriptor.props).toEqual({});
  });
}

describe('descriptors/NativeDescriptor', () => {
  describe('NativeDescriptor.get(schema, kind?)', () => {
    describe('ScalarDescriptor', () => {
      const schema = { type: 'string' } as any;
      const descriptor = NativeDescriptor.get(schema);

      it('should have common properties', () => {
        expect(Object.keys(descriptor)).toEqual([
          'label', 'description', 'component',
          'attrs', 'props', 'labels'
        ]);
      });

      ShouldHaveCommonProperties(schema, descriptor);
      ShouldLabelDescription({
        type: 'boolean',
        title: 'boolean',
        description: 'boolean Desc'
      });
    });

    describe('ArrayDescriptor', () => {
      const schema = { type: 'array' } as any;
      const descriptor = NativeDescriptor.get(schema);

      it('should have common properties', () => {
        expect(Object.keys(descriptor)).toEqual([
          'label', 'description', 'component',
          'attrs', 'props', 'items', 'addButtonLabel'
        ]);
      });

      ShouldHaveCommonProperties(schema, descriptor);
      ShouldLabelDescription({
        type: 'array',
        title: 'array title',
        description: 'array desc'
      });
    });

    describe('ObjectDescriptor', () => {
      const schema = { type: 'object' } as any;
      const descriptor = NativeDescriptor.get(schema);

      it('should have common properties', () => {
        expect(Object.keys(descriptor)).toEqual([
          'label', 'description', 'component',
          'attrs', 'props', 'order'
        ]);
      });

      ShouldHaveCommonProperties(schema, descriptor);
      ShouldLabelDescription({
        type: 'object',
        title: 'object title',
        description: 'object desc'
      });
    });

    it('should return descriptor with custum kind', () => {
      const schema = { type: 'number' } as any;
      const descriptor = NativeDescriptor.get(schema, 'boolean');
      const component = descriptor.component as any;

      expect(component.name).toBe('BooleanElement');
    });
  });
});
