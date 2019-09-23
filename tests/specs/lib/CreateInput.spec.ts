import { CreateInput } from '@/lib/CreateInput';

const MockData = {
  props: {
    field: {
      attrs: {},
      setValue: jest.fn()
    },
    descriptor: {
      attrs: {}
    }
  }
};

describe('lib/CreateInput', () => {
  describe('CreateInput(h, tag, data, children = [])', () => {
    it('should create an input with required args', () => {
      const h: any = jest.fn();

      CreateInput(h, 'input', MockData);

      const [ [ tag, data, children ] ] = h.mock.calls;

      expect(tag).toBe('input');

      expect(Object.keys(data)).toEqual([ 'key', 'attrs', 'on' ]);
      expect(Object.keys(data.on)).toEqual([ 'input' ]);
      expect(typeof data.on.input).toBe('function');

      expect(children).toEqual([]);
    });

    it('should create an input with children', () => {
      const h: any = jest.fn();

      CreateInput(h, 'input', MockData, 'hello');

      const [ [ tag, data, children ] ] = h.mock.calls;

      expect(tag).toBe('input');

      expect(Object.keys(data)).toEqual([ 'key', 'attrs', 'on' ]);
      expect(Object.keys(data.on)).toEqual([ 'input' ]);
      expect(typeof data.on.input).toBe('function');

      expect(children).toEqual('hello');
    });

    it('should set the field value on on.input() call', () => {
      const h: any = jest.fn();

      CreateInput(h, 'input', MockData);

      const [ [ /* tag */, data ] ] = h.mock.calls;

      data.on.input({
        target: {
          value: 'Hello, World!'
        }
      });

      const [ [ value ] ] = MockData.props.field.setValue.mock.calls;

      expect(value).toEqual('Hello, World!');
    });
  });
});
