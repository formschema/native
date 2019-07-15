import { Parser } from '@/parsers/Parser';
import { BooleanParser } from '@/parsers/BooleanParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

describe('parsers/BooleanParser', () => {
  const options: ParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'boolean' },
    model: undefined,
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new BooleanParser(options);

  parser.parse();

  it('parser should be an instance of Parser', () => {
    expect(parser).toBeInstanceOf(Parser);
  });

  it('parser.field.input.attrs.type should equal to checkbox', () => {
    expect(parser.field.input.attrs.type).toBe('checkbox');
  });

  it('parser.field.input.attrs.checked should be falsy', () => {
    expect(parser.field.input.attrs.checked).toBeFalsy;
  });

  it('field.value should be falsy', () => {
    expect(parser.field.input.value).toBeFalsy();
  });

  it('should successfully parse default truthy boolean value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: true,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeTruthy();
  });

  it('field.value should successfully parse default falsy boolean value', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: false,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeFalsy();
  });

  it('field.value should parse default non boolean value as an undefined model', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: 12,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.input.value).toBeUndefined();
  });
});
