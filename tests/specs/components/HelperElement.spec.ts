import { mount } from '@vue/test-utils';
import { HelperElement } from '@/components/HelperElement';
import { Options } from '../../lib/Options';

describe('components/HelperElement', () => {
  it('should successfully render component', () => {
    const { context } = Options.get({
      schema: {
        type: 'string',
        description: 'Your full name'
      },
      model: 'Goku',
      id: 'name'
    });

    const wrapper = mount(HelperElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component for non root field', () => {
    const { context } = Options.get({
      schema: {
        type: 'string',
        description: 'Your full name'
      },
      model: 'Goku',
      id: 'name'
    });

    context.props.field.isRoot = false;

    const wrapper = mount(HelperElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render nothing with missing field.descriptor.description', () => {
    const { context } = Options.get({
      schema: {
        type: 'string'
      },
      model: 'Goku',
      id: 'name'
    });

    const wrapper = mount(HelperElement, { context });

    expect(wrapper.html()).toBe('');
  });
});
