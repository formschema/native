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
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Empty array</legend><p id="id-characters-helper">Your characters</p><button type="button" disabled="disabled" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toBe(expected);
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
      model: ['freezer']
    });

    const wrapper = mount(ArrayElement, { context });
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Empty array</legend><p id="id-characters-helper">Your characters</p><button type="button" disabled="disabled" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toBe(expected);
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
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Characters</legend><p id="id-characters-helper">Your characters</p><div data-fs-kind="string" data-fs-type="text" data-fs-field="characters"><label for="id-characters-0"></label><div data-fs-input="text"><input id="id-characters-0" type="text" name="characters"><div data-fs-buttons="3"><button type="button" disabled="disabled">↑</button><button type="button" disabled="disabled">↓</button><button type="button">-</button></div></div></div><button type="button" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toMatchSnapshot(expected);
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
      model: ['Goku', 'Freezer']
    });

    const wrapper = mount(ArrayElement, { context });
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Characters</legend><p id="id-characters-helper">Your characters</p><div data-fs-kind="string" data-fs-type="text" data-fs-field="characters"><label for="id-characters-0"></label><div data-fs-input="text"><input id="id-characters-0" type="text" name="characters" value="Goku"><div data-fs-buttons="3"><button type="button" disabled="disabled">↑</button><button type="button">↓</button><button type="button">-</button></div></div></div><div data-fs-kind="string" data-fs-type="text" data-fs-field="characters"><label for="id-characters-1"></label><div data-fs-input="text"><input id="id-characters-1" type="text" name="characters" value="Freezer"><div data-fs-buttons="3"><button type="button">↑</button><button type="button" disabled="disabled">↓</button><button type="button">-</button></div></div></div><button type="button" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toMatchSnapshot(expected);
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
      model: ['Goku', 'Freezer']
    });

    const wrapper = mount(ArrayElement, { context });
    const button = wrapper.find('button[data-fs-button=push]');

    expect(parser.rawValue).toEqual(['Goku', 'Freezer']);

    button.trigger('click');

    expect(parser.rawValue).toEqual(['Goku', 'Freezer', undefined]);
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
          enum: ['Goku', 'Gohan', 'Vegeta', 'Picolo']
        },
        uniqueItems: true
      },
      model: ['Goku', 'Picolo'],
      onChange: onChangeMock
    });

    const wrapper = mount(ArrayElement, { context });
    const pushButton = wrapper.find('button[data-fs-button=push]');
    const inputs: any = wrapper.findAll('input[type=checkbox]');

    it('should don\'t have push button', () => {
      expect(pushButton.exists()).toBeFalsy();
    });

    it('should have exaltly schema.items.enum.length input[type=checkbox]', () => {
      expect(inputs.length).toBe(schema.items.enum.length);
    });

    it('should have right initial model', () => {
      const [ [ initialValue ] ] = onChangeMock.mock.calls;

      expect(initialValue).toEqual(['Goku', 'Picolo']);
      expect(onChangeMock.mock.calls.length).toBe(1);
    });

    it('should have updated model after interaction', () => {
      inputs.at(1).setChecked(true);

      const [ [], [ changedValue ] ] = onChangeMock.mock.calls;

      expect(changedValue).toEqual(['Goku', 'Gohan', 'Picolo']);
      expect(onChangeMock.mock.calls.length).toBe(2);
    });
  });
});
