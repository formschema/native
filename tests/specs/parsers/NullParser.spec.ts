import { Component } from 'vue';
import { NullParser } from '@/parsers/NullParser';
import { ScalarDescriptor, StringField, AbstractParserOptions, ObjectDescriptor } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';
import { JsonSchema } from '@/types/jsonschema';

describe('parsers/NullParser', () => {
  const options: AbstractParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'null' },
    model: undefined,
    descriptorConstructor: NativeDescriptor.get,
    $forceUpdate: () => {}
  };

  const parser = new NullParser(options);

  parser.parse();

  it('should have type === hidden', () => {
    expect(parser.field.attrs.input.type).toBe('hidden');
  });

  it('should have value === \u0000', () => {
    expect(parser.field.attrs.input.value).toBe('\u0000');
  });

  it('field.model should be equal to null', () => {
    expect(parser.field.model).toBe(null);
  });
});
