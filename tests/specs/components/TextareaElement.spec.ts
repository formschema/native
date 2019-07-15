import { mount } from '@vue/test-utils';
import { TextareaElement } from '@/components/TextareaElement';
import { StringParser } from '@/parsers/StringParser';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

const options: any = {
  schema: {
    type: 'string',
    title: 'Bio',
    description: 'Tell us about yourself'
  },
  model: 'Goku',
  id: 'id-bio',
  name: 'bio',
  onChange: jest.fn(),
  descriptor: {
    kind: 'textarea'
  },
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

describe('components/TextareaElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(TextareaElement, { context });
    const expected = '<div data-fs-kind="string" data-fs-field="bio"><label id="id-bio-label" for="id-bio">Bio</label><div data-fs-input="string"><textarea id="id-bio" name="bio" aria-labelledby="id-bio-label" aria-describedby="id-bio-desc">Goku</textarea><p id="id-bio-desc">Tell us about yourself</p></div></div>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully emit input event', () => {
    const wrapper = mount(TextareaElement, { context });
    const input: any = wrapper.find('textarea');

    input.element.value = 'Gohan';
    input.trigger('input');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('Goku');
    expect(changedValue).toEqual('Gohan');
  });
});
