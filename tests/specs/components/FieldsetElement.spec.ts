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
    const expected = '<fieldset id="id-character" name="character" aria-labelledby="id-character-label" aria-describedby="id-character-helper"><legend id="id-character-label" for="id-character">Character</legend><p id="id-character-helper">Your character</p><div data-fs-kind="radio" data-fs-type="radio" data-fs-field="character"><label id="id-character-goku-label" for="id-character-goku">Goku</label><div data-fs-wrapper="2"><div data-fs-input="radio"><input id="id-character-goku" type="radio" name="character" value="goku" aria-labelledby="id-character-goku-label" aria-describedby="id-character-goku-helper"></div><span id="id-character-goku-helper">Main Hero</span></div></div><div data-fs-kind="radio" data-fs-type="radio" data-fs-field="character"><label id="id-character-freezer-label" for="id-character-freezer">Freezer</label><div data-fs-wrapper="2"><div data-fs-input="radio"><input id="id-character-freezer" type="radio" name="character" value="freezer" checked="checked" aria-labelledby="id-character-freezer-label" aria-describedby="id-character-freezer-helper"></div><span id="id-character-freezer-helper">Main Monster</span></div></div></fieldset>';

    expect(wrapper.html()).toMatchSnapshot(expected);
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
    const expected = '<fieldset id="id-character" name="character"><div data-fs-kind="radio" data-fs-type="radio" data-fs-field="character"><label id="id-character-goku-label" for="id-character-goku">goku</label><div data-fs-input="radio"><input id="id-character-goku" type="radio" name="character" value="goku" aria-labelledby="id-character-goku-label"></div></div><div data-fs-kind="radio" data-fs-type="radio" data-fs-field="character"><label id="id-character-freezer-label" for="id-character-freezer">freezer</label><div data-fs-input="radio"><input id="id-character-freezer" type="radio" name="character" value="freezer" aria-labelledby="id-character-freezer-label"></div></div></fieldset>';

    expect(wrapper.html()).toMatchSnapshot(expected);
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

    // radioInput.setChecked(true);
    radioInput.trigger('click');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('freezer');
    expect(changedValue).toEqual('goku');
  });
});
