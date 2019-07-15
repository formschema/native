import { mount } from '@vue/test-utils';
import { FieldElement } from '@/components/FieldElement';
import { StringParser } from '@/parsers/StringParser';
import { Dictionary, ScalarDescriptor, ParserOptions } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

const options: ParserOptions<string, ScalarDescriptor> = {
  schema: {
    type: 'string',
    pattern: 'arya|jon',
    minLength: 5,
    maxLength: 15,
    title: 'Name',
    description: 'Your full name'
  },
  model: 'Goku',
  id: 'id-name',
  name: 'name',
  descriptorConstructor: NativeDescriptor.get
};

const parser = new StringParser(options);

parser.parse();

describe('components/FieldElement', () => {
  it('should successfully render component', () => {
    const context: any = {
      attrs: parser.field.input.attrs,
      props: {
        field: parser.field
      },
      children: []
    };

    const stubs: any = {
      HelperElement: true
    };

    const wrapper = mount(FieldElement, { context, stubs });
    const expected = '<div data-fs-kind="string" data-fs-field="name"><label id="id-name-label" for="id-name">Name</label><div data-fs-input="text"><p id="id-name-desc">Your full name</p></div></div>';

    expect(wrapper.is(FieldElement)).toBeTruthy();
    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully render component with missing field.input.attrs.type', () => {
    delete parser.field.input.attrs.type;

    const context: any = {
      attrs: parser.field.input.attrs,
      props: {
        field: parser.field
      },
      children: []
    };

    const stubs: any = {
      HelperElement: true
    };

    const wrapper = mount(FieldElement, { context, stubs });
    const expected = '<div data-fs-kind="string" data-fs-field="name"><label id="id-name-label" for="id-name">Name</label><div data-fs-input="string"><p id="id-name-desc">Your full name</p></div></div>';

    expect(wrapper.is(FieldElement)).toBeTruthy();
    expect(wrapper.html()).toBe(expected);
  });
});
