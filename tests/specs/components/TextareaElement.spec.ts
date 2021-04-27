import { mount } from '@vue/test-utils';
import { TextareaElement } from '@/components/TextareaElement';
import { Options } from '../../lib/Options';

const onChangeMock = jest.fn();
const { context } = Options.get({
  kind: 'textarea',
  schema: {
    type: 'string',
    title: 'Bio',
    description: 'Tell us about yourself'
  },
  model: 'Goku',
  id: 'id-bio',
  name: 'bio',
  onChange: onChangeMock,
  descriptor: {
    kind: 'textarea'
  }
});

describe('components/TextareaElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(TextareaElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully emit input event', () => {
    const wrapper = mount(TextareaElement, { context });
    const input: any = wrapper.find('textarea');

    input.setValue('Gohan');

    const [ [ initialValue ], [ changedValue ] ] = onChangeMock.mock.calls;

    expect(initialValue).toEqual('Goku');
    expect(changedValue).toEqual('Gohan');
  });
});
