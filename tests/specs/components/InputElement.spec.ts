import { mount } from '@vue/test-utils';
import { InputElement } from '@/components/InputElement';
import { StringParser } from '@/parsers/StringParser';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';

const options: any = {
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
  onChange: jest.fn(),
  descriptorConstructor: new NativeDescriptor(NativeElements)
};

const parser = new StringParser(options);

parser.parse();

const context: any = {
  attrs: parser.field.input.attrs,
  props: {
    field: parser.field
  }
};

describe('components/InputElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(InputElement, { context });
    const expected = '<div data-fs-kind="string" data-fs-field="name"><label id="id-name-label" for="id-name">Name</label><div data-fs-input="text"><input id="id-name" type="text" name="name" aria-labelledby="id-name-label" aria-describedby="id-name-helper" value="Goku" minlength="5" maxlength="15" pattern="arya|jon"><p id="id-name-helper">Your full name</p></div></div>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully emit input event', () => {
    const wrapper = mount(InputElement, { context });
    const input: any = wrapper.find('input');

    input.element.value = 'Gohan';
    input.trigger('input');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('Goku');
    expect(changedValue).toEqual('Gohan');
  });
});
