import { mount } from '@vue/test-utils';
import { ListElement } from '@/components/ListElement';
import { ListParser } from '@/parsers/ListParser';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { NativeElements } from '@/lib/NativeElements';

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
        label: 'Goku'
      },
      freezer: {
        label: 'Freezer'
      }
    }
  },
  descriptorConstructor: new NativeDescriptor(NativeElements)
};

const parser = new ListParser(options);

parser.parse();

const context: any = {
  attrs: parser.field.input.attrs,
  props: {
    field: parser.field
  }
};

describe('components/ListElement', () => {
  it('should successfully render component', () => {
    const wrapper = mount(ListElement, { context });
    const expected = '<div data-fs-kind="list" data-fs-field="character"><label id="id-character-label" for="id-character">Character</label><div data-fs-wrapper="2"><div data-fs-input="list"><select id="id-character" name="character" aria-labelledby="id-character-label" aria-describedby="id-character-helper"><option value=""></option><option value="goku">Goku</option><option value="freezer" selected="selected">Freezer</option></select></div><p id="id-character-helper">Your character</p></div></div>';

    expect(wrapper.html()).toBe(expected);
  });

  it('should successfully emit input event', () => {
    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');
    const option: any = wrapper.find('option[value=goku]');

    option.element.selected = true;

    select.trigger('change');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('freezer');
    expect(changedValue).toEqual('goku');
  });
});
