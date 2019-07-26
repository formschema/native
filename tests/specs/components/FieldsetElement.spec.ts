import { mount } from '@vue/test-utils';
import { FieldsetElement } from '@/components/FieldsetElement';
import { EnumParser } from '@/parsers/EnumParser';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

import '@/parsers';

const options: any = {
  schema: {
    type: 'string',
    title: 'Character',
    description: 'Your character',
    enum: ['goku', 'freezer']
  },
  model: 'freezer',
  id: 'id-character',
  name: 'character',
  onChange: jest.fn(),
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
  },
  descriptorConstructor: NativeDescriptor.get
};

const parser: any = new EnumParser(options);

parser.parse();

const context: any = {
  props: {
    field: parser.field
  }
};

describe('components/FieldsetElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(FieldsetElement, { context });
    const expected = '<fieldset id="id-character" name="character" aria-labelledby="id-character-label" aria-describedby="id-character-helper"><legend id="id-character-label" for="id-character">Character</legend><p id="id-character-helper">Your character</p><div data-fs-kind="radio" data-fs-field="character"><label id="character-goku-label" for="character-goku">Goku</label><div data-fs-input="radio"><input id="character-goku" type="radio" name="character" aria-labelledby="character-goku-label" aria-describedby="character-goku-helper" value="goku"><span id="character-goku-helper">Main Hero</span></div></div><div data-fs-kind="radio" data-fs-field="character"><label id="character-freezer-label" for="character-freezer">Freezer</label><div data-fs-input="radio"><input id="character-freezer" type="radio" name="character" aria-labelledby="character-freezer-label" aria-describedby="character-freezer-helper" value="freezer" checked="checked"><span id="character-freezer-helper">Main Monster</span></div></div></fieldset>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully render component without schema title and description', () => {
    const options: any = {
      schema: {
        type: 'string',
        enum: ['goku', 'freezer']
      },
      model: undefined,
      id: 'id-character',
      name: 'character',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new EnumParser(options);

    parser.parse();

    const context: any = {
      props: {
        field: parser.field
      }
    };

    const wrapper = mount(FieldsetElement, { context });
    const expected = '<fieldset id="id-character" name="character"><div data-fs-kind="radio" data-fs-field="character"><label id="character-goku-label" for="character-goku">goku</label><div data-fs-input="radio"><input id="character-goku" type="radio" name="character" aria-labelledby="character-goku-label" value="goku"></div></div><div data-fs-kind="radio" data-fs-field="character"><label id="character-freezer-label" for="character-freezer">freezer</label><div data-fs-input="radio"><input id="character-freezer" type="radio" name="character" aria-labelledby="character-freezer-label" value="freezer"></div></div></fieldset>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully emit input event', () => {
    const wrapper = mount(FieldsetElement, { context });
    const input: any = wrapper.find('input');

    input.element.checked = true;

    input.trigger('click');
    input.trigger('change');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('freezer');
    expect(changedValue).toEqual('goku');
  });
});
