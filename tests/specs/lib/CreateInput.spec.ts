import sinon from 'sinon';
import { CreateInput } from '@/lib/CreateInput';

describe('lib/CreateInput', () => {
  describe('CreateInput(h, tag, data, children = [])', () => {
    it('should create an input with required args', () => {
      const h = sinon.stub();

      CreateInput(h, 'input', {});

      const [ [ tag, data, children ] ] = h.args;

      expect(tag).toBe('input');

      expect(Object.keys(data)).toEqual([ 'on' ]);
      expect(Object.keys(data.on)).toEqual([ 'input' ]);
      expect(typeof data.on.input).toBe('function');

      expect(children).toEqual([]);
    });

    it('should create an input with children', () => {
      const h = sinon.stub();

      CreateInput(h, 'input', {}, 'hello');

      const [ [ tag, data, children ] ] = h.args;

      expect(tag).toBe('input');

      expect(Object.keys(data)).toEqual([ 'on' ]);
      expect(Object.keys(data.on)).toEqual([ 'input' ]);
      expect(typeof data.on.input).toBe('function');

      expect(children).toEqual('hello');
    });

    it('should set the field value on on.input() call', () => {
      const h = sinon.stub();
      const data = {
        props: {
          field: {
            setValue: sinon.stub()
          }
        }
      };

      CreateInput(h, 'input', data);

      const [ [ tag, definition ] ] = h.args;

      definition.on.input({
        target: {
          value: 'Hello, World!'
        }
      });

      const [ [ value ] ] = data.props.field.setValue.args;

      expect(value).toEqual('Hello, World!');
    });
  });
});
