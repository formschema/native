import { mount } from '@vue/test-utils';
import { ListElement } from '@/components/ListElement';
import { Options } from '../../lib/Options';

const onChangeMock = jest.fn();
const { context } = Options.get({
  kind: 'list',
  schema: {
    type: 'string',
    title: 'Character',
    description: 'Your character',
    enum: [ 'goku', 'freezer' ]
  },
  model: 'freezer',
  id: 'id-character',
  name: 'character',
  onChange: onChangeMock,
  descriptor: {
    items: {
      goku: {
        label: 'Goku'
      },
      freezer: {
        label: 'Freezer'
      }
    }
  }
});

describe('components/ListElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(ListElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully emit input event', () => {
    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');

    select.setValue('goku');

    const [ [ initialValue ], [ changedValue ] ] = onChangeMock.mock.calls;

    expect(initialValue).toEqual('freezer');
    expect(changedValue).toEqual('goku');
  });

  it('should successfully emit input event with an integer schema', () => {
    const onChangeMock = jest.fn();
    const { context } = Options.get({
      kind: 'list',
      schema: {
        type: 'number',
        enum: [ 1, 2, 3 ]
      },
      model: 2,
      onChange: onChangeMock
    });

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');

    select.setValue(3);

    const [ [ initialValue ], [ changedValue ] ] = onChangeMock.mock.calls;

    expect(initialValue).toEqual(2);
    expect(changedValue).toEqual(3);
  });

  it('should successfully emit input event with a boolean schema', () => {
    const onChangeMock = jest.fn();
    const { context } = Options.get({
      kind: 'list',
      schema: {
        type: 'boolean',
        enum: [ true, false ]
      },
      model: true,
      id: 'id',
      onChange: onChangeMock
    });

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');

    select.setValue('false');

    const [ [ initialValue ], [ changedValue ] ] = onChangeMock.mock.calls;

    expect(initialValue).toEqual(true);
    expect(changedValue).toEqual(false);
  });

  it('should successfully emit input event with a null schema', () => {
    const onChangeMock = jest.fn();
    const { context } = Options.get({
      kind: 'list',
      schema: {
        type: 'null',
        enum: [ null, null ]
      },
      model: null,
      id: 'id',
      onChange: onChangeMock
    });

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');
    const optionElements: any = wrapper.findAll('option');
    const option: any = optionElements.at(2);

    option.element.selected = true;

    select.trigger('change');

    const [ [ initialValue ], [ changedValue ] ] = onChangeMock.mock.calls;

    expect(initialValue).toEqual(null);
    expect(changedValue).toEqual(null);
  });

  it('should successfully emit input event with a string schema', () => {
    const { context, options } = Options.get({
      kind: 'list',
      schema: {
        type: 'string',
        enum: [ 'goku', 'freezer' ]
      },
      model: 'goku',
      onChange: jest.fn()
    });

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');

    select.setValue('freezer');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('goku');
    expect(changedValue).toEqual('freezer');
  });
});
