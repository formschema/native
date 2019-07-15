import { mount } from '@vue/test-utils';
import { HelperElement } from '@/components/HelperElement';
import { StringParser } from '@/parsers/StringParser';
import { ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

describe('components/HelperElement', () => {
  it('should successfully render component', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: {
        type: 'string',
        description: 'Your full name'
      },
      model: 'Goku',
      id: 'name',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    const context: any = {
      attrs: parser.field.input.attrs,
      props: {
        field: parser.field
      }
    };

    const wrapper = mount(HelperElement, { context });
    const expected = '<p id="name-helper">Your full name</p>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully render component for non root field', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: {
        type: 'string',
        description: 'Your full name'
      },
      model: 'Goku',
      id: 'name',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    parser.field.isRoot = false;

    const context: any = {
      attrs: parser.field.input.attrs,
      props: {
        field: parser.field
      }
    };

    const wrapper = mount(HelperElement, { context });
    const expected = '<span id="name-helper">Your full name</span>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should render nothing with missing field.descriptor.description', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: {
        type: 'string'
      },
      model: 'Goku',
      id: 'name',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new StringParser(options);

    parser.parse();

    const context: any = {
      attrs: parser.field.input.attrs,
      props: {
        field: parser.field
      }
    };

    const wrapper = mount(HelperElement, { context });

    expect(wrapper.html()).toBeUndefined();
  });
});
