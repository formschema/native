import { mount } from '@vue/test-utils';
import { FieldElement } from '@/components/FieldElement';
import { Options } from '../../lib/Options';

const { context, descriptor } = Options.get({
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
  name: 'name'
});

const stubs: any = {
  HelperElement: true
};

describe('components/FieldElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(FieldElement, { context, stubs });
    const expected = '<div data-fs-kind="string" data-fs-type="text" data-fs-field="name"><label id="id-name-label" for="id-name">Name</label><div data-fs-wrapper="2"><div data-fs-input="text"></div><p id="id-name-helper">Your full name</p></div></div>';

    expect(wrapper.is(FieldElement)).toBeTruthy();
    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully render component with missing descriptor.attrs.type', () => {
    delete descriptor.attrs.type;

    const wrapper = mount(FieldElement, { context, stubs });
    const expected = '<div data-fs-kind="string" data-fs-type="string" data-fs-field="name"><label id="id-name-label" for="id-name">Name</label><div data-fs-wrapper="2"><div data-fs-input="string"></div><p id="id-name-helper">Your full name</p></div></div>';

    expect(wrapper.is(FieldElement)).toBeTruthy();
    expect(wrapper.html()).toBe(expected);
  });
});
