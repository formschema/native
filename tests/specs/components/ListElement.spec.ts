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
    const expected = '<div data-fs-kind="list" data-fs-type="list" data-fs-field="character"><label id="id-character-label" for="id-character">Character</label><div data-fs-wrapper="2"><div data-fs-input="list"><select id="id-character" name="character" aria-labelledby="id-character-label" aria-describedby="id-character-helper"><option value=""></option><option value="goku">Goku</option><option value="freezer" selected="selected">Freezer</option></select></div><p id="id-character-helper">Your character</p></div></div>';

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

  it('should successfully emit input event with an integer schema', () => {
    const options: any = {
      schema: {
        type: 'number',
        enum: [1, 2, 3]
      },
      model: 2,
      onChange: jest.fn(),
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

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');
    const option: any = wrapper.find('option[value="3"]');

    option.element.selected = true;

    select.trigger('change');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual(2);
    expect(changedValue).toEqual(3);
  });

  it('should successfully emit input event with a boolean schema', () => {
    const options: any = {
      schema: {
        type: 'boolean',
        enum: [true, false]
      },
      model: true,
      id: 'id',
      onChange: jest.fn(),
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

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');
    const option: any = wrapper.find('option[value="false"]');

    option.element.selected = true;

    select.trigger('change');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual(true);
    expect(changedValue).toEqual(false);
  });

  it('should successfully emit input event with a null schema', () => {
    const options: any = {
      schema: {
        type: 'null',
        enum: [null, null]
      },
      model: null,
      id: 'id',
      onChange: jest.fn(),
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

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');
    const optionElements: any = wrapper.findAll('option');
    const option: any = optionElements.at(2);

    option.element.selected = true;

    select.trigger('change');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual(null);
    expect(changedValue).toEqual(null);
  });

  it('should successfully emit input event with an unknow schema', () => {
    const options: any = {
      schema: {
        type: 'unknow',
        enum: ['goku', 'freezer']
      },
      model: 'goku',
      onChange: jest.fn(),
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

    const wrapper = mount(ListElement, { context });
    const select = wrapper.find('select');
    const option: any = wrapper.find('option[value="freezer"]');

    option.element.selected = true;

    select.trigger('change');

    const [ [ initialValue ], [ changedValue ] ] = options.onChange.mock.calls;

    expect(initialValue).toEqual('goku');
    expect(changedValue).toEqual('freezer');
  });
});
