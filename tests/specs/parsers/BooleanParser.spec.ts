import { AbstractParser } from '@/parsers/AbstractParser';
import { BooleanParser } from '@/parsers/BooleanParser';
import { ScalarDescriptor, AbstractParserOptions } from '@/types';
import { NativeDescriptor } from '@/descriptors/NativeDescriptor';

describe('parsers/BooleanParser', () => {
  const options: AbstractParserOptions<any, ScalarDescriptor> = {
    schema: { type: 'boolean' },
    model: undefined,
    descriptorConstructor: NativeDescriptor.get
  };

  const parser = new BooleanParser(options);

  parser.parse();

  it('parser should be an instance of AbstractParser', () => {
    expect(parser).toBeInstanceOf(AbstractParser);
  });

  it('parser.field.attrs.input.type should equal to checkbox', () => {
    expect(parser.field.attrs.input.type).toBe('checkbox');
  });

  it('parser.field.attrs.input.checked should be falsy', () => {
    expect(parser.field.attrs.input.checked).toBeFalsy;
  });

  it('field.model should be falsy', () => {
    expect(parser.field.model).toBeFalsy();
  });

  it('should successfully parse default truthy boolean value', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: true,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.model).toBeTruthy();
  });

  it('field.model should successfully parse default falsy boolean value', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: false,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.model).toBeFalsy();
  });

  it('field.model should parse default non boolean value as an undefined model', () => {
    const options: AbstractParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'boolean' },
      model: 12,
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new BooleanParser(options);

    parser.parse();

    expect(parser.field.model).toBeUndefined();
  });
});
