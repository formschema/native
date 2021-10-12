import { mount } from '@vue/test-utils';
import { ArrayElement } from '@/components/ArrayElement';
import { Options } from '../../lib/Options';

describe('components/ArrayElement', () => {
  it('should successfully render component with an empty array', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Empty array',
        description: 'Your characters'
      }
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with an empty array with a defined model', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Empty array',
        description: 'Your characters'
      },
      model: [ 'freezer' ]
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with an array schema with an empty model', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        minItems: 1,
        maxItems: 3,
        items: { type: 'string' }
      },
      model: []
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with an array schema with an empty model and minItem === maxItem', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        minItems: 1,
        maxItems: 1,
        items: { type: 'string' }
      },
      model: []
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with an array schema with a model and value.length === 1 and minItem === 0', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        minItems: 0,
        items: { type: 'string' }
      },
      model: [ 'goku' ]
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with an array schema with a model and value.length === 1', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: [ 'goku' ]
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with an array schema with a model and value.length > 1', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        items: { type: 'string' }
      },
      model: [ 'goku', 'goten' ]
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component with an array schema with a defined model', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        minItems: 1,
        maxItems: 3,
        items: { type: 'string' }
      },
      model: [ 'Goku', 'Freezer' ]
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component without the push button when maxItems <= 1', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        maxItems: 1,
        items: {
          type: 'string'
        },
        default: [ 'Goku' ]
      }
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should successfully render component without the push button when maxItems <= 1 and minItems === 1', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        minItems: 1,
        maxItems: 1,
        items: {
          type: 'string'
        },
        default: [ 'Goku' ]
      }
    });

    const wrapper = mount(ArrayElement, { context });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('clicking to the push button should successfully update the parser model', () => {
    const { context, parser } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        minItems: 0,
        maxItems: 3,
        items: [
          { type: 'string', default: 'Goku' },
          { type: 'string', default: 'Freezer' }
        ]
      },
      model: []
    });

    const wrapper = mount(ArrayElement, { context });
    const button = wrapper.find('button[data-fs-button=push]');

    expect(parser.model).toEqual([]);

    button.trigger('click');
    expect(parser.model).toEqual([ 'Goku' ]);

    button.trigger('click');
    expect(parser.model).toEqual([ 'Goku', 'Freezer' ]);
  });

  it('clicking to the push button should successfully trigger the options.onChange callback', () => {
    const { context, parser } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        minItems: 1,
        maxItems: 3,
        items: { type: 'string' }
      },
      model: [ 'Goku', 'Freezer' ]
    });

    const wrapper = mount(ArrayElement, { context });
    const button = wrapper.find('button[data-fs-button=push]');

    expect(parser.model).toEqual([ 'Goku', 'Freezer' ]);
    expect(parser.rawValue).toEqual([ 'Goku', 'Freezer' ]);

    button.trigger('click');

    expect(parser.model).toEqual([ 'Goku', 'Freezer' ]);
    expect(parser.rawValue).toEqual([ 'Goku', 'Freezer', undefined ]);
  });

  describe('clicking to the push button should successfully render a new array item', () => {
    const { context, parser } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your characters',
        items: [
          { type: 'string', default: 'Goku', title: 'First' },
          { type: 'string', default: 'Freezer', title: 'Last' }
        ]
      },
      model: []
    });

    const wrapper = mount(ArrayElement, { context });
    const button = wrapper.find('button[data-fs-button=push]');

    it('initial state: the fieldset is rendered with the push button', () => {
      expect(parser.model).toEqual([]);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('first push button click: render the first input', () => {
      button.trigger('click');
      expect(parser.model).toEqual([ 'Goku' ]);
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('second push button click: render the last input and disable the push button (no more item to add)', () => {
      button.trigger('click');
      expect(parser.model).toEqual([ 'Goku', 'Freezer' ]);
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('should successfully render enum array schema', () => {
    const onChangeMock = jest.fn();
    const { context, schema } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your favorite characters',
        items: {
          type: 'string',
          enum: [ 'Goku', 'Gohan', 'Vegeta', 'Picolo' ]
        },
        uniqueItems: true
      },
      model: [ 'Goku', 'Picolo' ],
      onChange: onChangeMock
    });

    const wrapper = mount(ArrayElement, { context });
    const pushButton = wrapper.find('button[data-fs-button=push]');
    const inputs: any = wrapper.findAll('input[type=checkbox]');

    it('should render component', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('should don\'t have push button', () => {
      expect(pushButton.exists()).toBeFalsy();
    });

    it('should have exaltly schema.items.enum.length input[type=checkbox]', () => {
      expect(inputs.length).toBe(schema.items.enum.length);
    });

    it('should have right initial model', () => {
      const [ [ initialValue ] ] = onChangeMock.mock.calls;

      expect(initialValue).toEqual([ 'Goku', 'Picolo' ]);
      expect(onChangeMock.mock.calls.length).toBe(1);
    });

    it('should have updated model after interaction', () => {
      inputs.at(1).setChecked(true);

      // eslint-disable-next-line no-empty-pattern
      const [ [], [ changedValue ] ] = onChangeMock.mock.calls;

      expect(changedValue).toEqual([ 'Goku', 'Gohan', 'Picolo' ]);
      expect(onChangeMock.mock.calls.length).toBe(2);
    });
  });

  describe('should successfully render enum array schema with descriptor', () => {
    const { context } = Options.get({
      id: 'id-characters',
      name: 'characters',
      schema: {
        type: 'array',
        title: 'Characters',
        description: 'Your favorite characters',
        items: {
          type: 'string',
          enum: [ 'goku', 'gohan', 'vegeta', 'picolo' ]
        },
        uniqueItems: true
      },
      model: [ 'goku', 'picolo' ],
      descriptor: {
        items: {
          goku: { label: 'Goku' },
          picolo: { label: 'Picolo' }
        }
      }
    });

    const wrapper = mount(ArrayElement, { context });

    it('should render component', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
