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

    expect(wrapper.html()).toMatchSnapshot();
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
