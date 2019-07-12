import { mount } from '@vue/test-utils';
import { InputElement } from '@/components/InputElement';
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

describe('components/InputElement', () => {
  it('should successfully render component', () => {
    const context: any = {
      attrs: parser.field.attrs.input,
      props: {
        field: parser.field
      }
    };

    const wrapper = mount(InputElement, { context });
    const expected = '<div data-fs-kind="string" data-fs-field="name"><label id="id-name-label" for="id-name">Name</label><div data-fs-input="text"><input id="id-name" type="text" name="name" aria-labelledby="id-name-label" aria-describedby="id-name-desc" value="Goku" minlength="5" maxlength="15" pattern="arya|jon"><p id="id-name-desc">Your full name</p></div></div>';

    expect(wrapper.html()).toBe(expected);
  });
});
