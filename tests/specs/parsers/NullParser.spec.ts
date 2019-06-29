import { AbstractParser } from '@/parsers/AbstractParser';
import { NullParser } from '@/parsers/NullParser';
import { ScalarDescriptor, AbstractParserOptions } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';

describe('parsers/NullParser', () => {
  const options: AbstractParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'null' },
    model: undefined,
    descriptorConstructor: NativeDescriptor.get,
    $forceUpdate: () => {}
  };

  const parser = new NullParser(options);

  parser.parse();

  it('parser should be an instance of AbstractParser', () => {
    expect(parser).toBeInstanceOf(AbstractParser);
  });

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
