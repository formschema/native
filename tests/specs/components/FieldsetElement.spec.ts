import { mount } from '@vue/test-utils';
import { FieldsetElement } from '@/components/FieldsetElement';
import { Options } from '../../lib/Options';

describe('components/FieldsetElement', () => {
  it('should successfully render component', () => {
    const { context } = Options.get({
      schema: {
        type: 'string',
        title: 'Character',
        description: 'Your character',
        enum: [ 'goku', 'freezer' ]
      },
      model: 'freezer',
      id: 'id-character',
      name: 'character',
      descriptor: {
        items: {
          goku: {
            label: 'Goku',
            helper: 'Main Hero'
          },
          freezer: {
            label: 'Freezer',
            helper: 'Main Monster'
          }
        }
      }
    });

    const wrapper = mount(FieldsetElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component without schema title and description', () => {
    const { context } = Options.get({
      schema: {
        type: 'string',
        enum: [ 'goku', 'freezer' ]
      },
      model: undefined,
      id: 'id-character',
      name: 'character'
    });

    const wrapper = mount(FieldsetElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully emit change event', () => {
    const { context, options } = Options.get({
      schema: {
        type: 'string',
        enum: [ 'goku', 'freezer' ]
      },
      model: 'freezer',
      onChange: jest.fn()
    });

    const wrapper = mount(FieldsetElement, { context });
    const radioInput = wrapper.find('input[value="goku"]');

    radioInput.setChecked(true);

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('freezer');
    expect(changedValue).toEqual('goku');
  });
});
