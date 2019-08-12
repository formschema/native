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
    const expected = '<div data-fs-kind="textarea" data-fs-type="textarea" data-fs-field="bio"><label id="id-bio-label" for="id-bio">Bio</label><div data-fs-wrapper="2"><div data-fs-input="textarea"><textarea id="id-bio" name="bio" aria-labelledby="id-bio-label" aria-describedby="id-bio-helper">Goku</textarea></div><p id="id-bio-helper">Tell us about yourself</p></div></div>';

    expect(wrapper.html()).toBe(expected);
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
