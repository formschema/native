import { CreateInput } from '@/lib/CreateInput';

describe('lib/CreateInput', () => {
  describe('CreateInput(h, tag, data, children = [])', () => {
    it('should create an input with required args', () => {
      const h: any = jest.fn((...args) => args);

      CreateInput(h, 'input', {});

      const [ [ tag, data, children ] ] = h.mock.calls;

      expect(tag).toBe('input');

      expect(Object.keys(data)).toEqual([ 'on' ]);
      expect(Object.keys(data.on)).toEqual([ 'input' ]);
      expect(typeof data.on.input).toBe('function');

      expect(children).toEqual([]);
    });

    it('should create an input with children', () => {
      const h: any = jest.fn((...args) => args);

      CreateInput(h, 'input', {}, 'hello');

      const [ [ tag, data, children ] ] = h.mock.calls;

      expect(tag).toBe('input');

      expect(Object.keys(data)).toEqual([ 'on' ]);
      expect(Object.keys(data.on)).toEqual([ 'input' ]);
      expect(typeof data.on.input).toBe('function');

      expect(children).toEqual('hello');
    });

    it('should set the field value on on.input() call', () => {
      const h: any = jest.fn((...args) => args);
      const data = {
        props: {
          field: {
            setValue: jest.fn((...args) => args)
          }
        }
      };

      CreateInput(h, 'input', data);

      const [ [ tag, definition ] ] = h.mock.calls;

      definition.on.input({
        target: {
          value: 'Hello, World!'
        }
      });

      const [ [ value ] ] = data.props.field.setValue.mock.calls;

      expect(value).toEqual('Hello, World!');
    });
  });
});
