import { Parser } from '@/parsers/Parser';
import { NullParser } from '@/parsers/NullParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

describe('parsers/NullParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'null' },
    model: undefined,
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new NullParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('should have type === hidden', () => {
    expect(parser.field.input.attrs.type).toBe('hidden');
  });

  it('should have value === \u0000', () => {
    expect(parser.field.input.attrs.value).toBe('\u0000');
  });

  it('field.value should be equal to null', () => {
    expect(parser.field.input.value).toBe(null);
  });
});
