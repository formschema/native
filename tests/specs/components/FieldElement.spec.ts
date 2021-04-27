import { mount } from '@vue/test-utils';
import { FieldElement } from '@/components/FieldElement';
import { Options } from '../../lib/Options';

const { context, field } = Options.get({
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

    expect(wrapper.is(FieldElement)).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with missing field.attrs.type', () => {
    delete field.attrs.type;

    const wrapper = mount(FieldElement, { context, stubs });

    expect(wrapper.is(FieldElement)).toBeTruthy();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
