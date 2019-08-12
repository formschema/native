import { mount } from '@vue/test-utils';
import { InputElement } from '@/components/InputElement';
import { Options } from '../../lib/Options';

const onChangeMock = jest.fn();
const { context } = Options.get({
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
  onChange: onChangeMock
});

describe('components/InputElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(InputElement, { context });
    const expected = '<div data-fs-kind="string" data-fs-type="text" data-fs-field="name"><label id="id-name-label" for="id-name">Name</label><div data-fs-wrapper="2"><div data-fs-input="text"><input id="id-name" type="text" name="name" value="Goku" pattern="arya|jon" minlength="5" maxlength="15" aria-labelledby="id-name-label" aria-describedby="id-name-helper"></div><p id="id-name-helper">Your full name</p></div></div>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully emit input event', () => {
    const wrapper = mount(InputElement, { context });
    const input: any = wrapper.find('input');

    input.setValue('Gohan');

    const [ [ initialValue ], [ changedValue ] ] = onChangeMock.mock.calls;

    expect(initialValue).toEqual('Goku');
    expect(changedValue).toEqual('Gohan');
  });
});
