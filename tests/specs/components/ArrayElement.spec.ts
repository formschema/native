import { mount } from '@vue/test-utils';
import { JsonSchema } from '@/types/jsonschema';
import { ArrayElement } from '@/components/ArrayElement';
import { ArrayParser } from '@/parsers/ArrayParser';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import '@/parsers';

function getContext(schema: JsonSchema, model: any) {
  const options: any = {
    schema: schema,
    model: model,
    id: 'id-characters',
    name: 'characters',
    onChange: jest.fn(),
    descriptorConstructor: NativeDescriptor.get
  };

  const parser: any = new ArrayParser(options);

  parser.parse();

  return {
    parser,
    options,
    context: {
      props: {
        field: parser.field
      }
    }
  };
}

describe('components/ArrayElement', () => {
  it('should successfully render component with an empty array', () => {
    const schema: JsonSchema = {
      type: 'array',
      title: 'Empty array',
      description: 'Your characters'
    };

    const { context } = getContext(schema, []);

    const wrapper = mount(ArrayElement, { context });
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Empty array</legend><p id="id-characters-helper">Your characters</p><button type="button" disabled="disabled" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully render component with an empty array with a defined model', () => {
    const schema: JsonSchema = {
      type: 'array',
      title: 'Empty array',
      description: 'Your characters'
    };

    const { context } = getContext(schema, ['freezer']);

    const wrapper = mount(ArrayElement, { context });
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Empty array</legend><p id="id-characters-helper">Your characters</p><button type="button" disabled="disabled" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully render component with an array schema with an empty model', () => {
    const schema: JsonSchema = {
      type: 'array',
      title: 'Characters',
      description: 'Your characters',
      minItems: 1,
      maxItems: 3,
      items: { type: 'string' }
    };

    const { context } = getContext(schema, []);

    const wrapper = mount(ArrayElement, { context });
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Characters</legend><p id="id-characters-helper">Your characters</p><div data-fs-kind="string" data-fs-field="characters"><label for="id-characters-0"></label><div data-fs-input="text"><input id="id-characters-0" type="text" name="characters"><div data-fs-buttons="true"><button type="button" data-fs-button="clear">x</button><button type="button" disabled="disabled" data-fs-button="move-up">↑</button><button type="button" disabled="disabled" data-fs-button="move-down">↓</button><button type="button" data-fs-button="delete">-</button></div></div></div><button type="button" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully render component with an array schema with a defined model', () => {
    const schema: JsonSchema = {
      type: 'array',
      title: 'Characters',
      description: 'Your characters',
      minItems: 1,
      maxItems: 3,
      items: { type: 'string' }
    };

    const { context } = getContext(schema, ['Goku', 'Freezer']);

    const wrapper = mount(ArrayElement, { context });
    const expected = '<fieldset id="id-characters" name="characters" aria-labelledby="id-characters-label" aria-describedby="id-characters-helper"><legend id="id-characters-label" for="id-characters">Characters</legend><p id="id-characters-helper">Your characters</p><div data-fs-kind="string" data-fs-field="characters"><label for="id-characters-0"></label><div data-fs-input="text"><input id="id-characters-0" type="text" name="characters" value="Goku"><div data-fs-buttons="true"><button type="button" data-fs-button="clear">x</button><button type="button" disabled="disabled" data-fs-button="move-up">↑</button><button type="button" data-fs-button="move-down">↓</button><button type="button" data-fs-button="delete">-</button></div></div></div><div data-fs-kind="string" data-fs-field="characters"><label for="id-characters-1"></label><div data-fs-input="text"><input id="id-characters-1" type="text" name="characters" value="Freezer"><div data-fs-buttons="true"><button type="button" data-fs-button="clear">x</button><button type="button" data-fs-button="move-up">↑</button><button type="button" disabled="disabled" data-fs-button="move-down">↓</button><button type="button" data-fs-button="delete">-</button></div></div></div><button type="button" data-fs-button="push">+</button></fieldset>';

    expect(wrapper.html()).toBe(expected);
  });

  it('clicking to the push button should successfully trigger the options.onChange callback', () => {
    const schema: JsonSchema = {
      type: 'array',
      title: 'Characters',
      description: 'Your characters',
      minItems: 1,
      maxItems: 3,
      items: { type: 'string' }
    };

    const { context, parser } = getContext(schema, ['Goku', 'Freezer']);

    const wrapper = mount(ArrayElement, { context });
    const button = wrapper.find('button[data-fs-button=push]');

    expect(parser.rawValue).toEqual(['Goku', 'Freezer']);

    button.trigger('click');

    expect(parser.rawValue).toEqual(['Goku', 'Freezer', undefined]);
  });

  describe('should successfully render enum array schema', () => {
    const schema: JsonSchema = {
      type: 'array',
      title: 'Characters',
      description: 'Your favorite characters',
      items: {
        type: 'string',
        enum: ['Goku', 'Gohan', 'Vegeta', 'Picolo']
      },
      uniqueItems: true
    };

    const { context, options } = getContext(schema, ['Goku', 'Picolo']);

    const wrapper = mount(ArrayElement, { context });
    const pushButton = wrapper.find('button[data-fs-button=push]');
    const inputs: any = wrapper.findAll('input[type=checkbox]');

    it('should don\'t have push button', () => {
      expect(pushButton.exists()).toBeFalsy();
    });

    it('should have exaltly schema.items.enum.length input[type=checkbox]', () => {
      expect(inputs.length).toBe(options.schema.items.enum.length);
    });

    it('should have right initial model', () => {
      const [ [ initialValue ] ] = options.onChange.mock.calls;

      expect(initialValue).toEqual(['Goku', 'Picolo']);
      expect(options.onChange.mock.calls.length).toBe(1);
    });

    it('should have updated model after interaction', () => {
      inputs.at(1).setChecked(true);

      const [ [], [ changedValue ] ] = options.onChange.mock.calls;

      expect(changedValue).toEqual(['Goku', 'Gohan', 'Picolo']);
      expect(options.onChange.mock.calls.length).toBe(2);
    });
  });
});
