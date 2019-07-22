import { Components } from '@/lib/Components';

describe('lib/Components', () => {
  it('should have predefined items', () => {
    const components = new Components();
    const expected = {
      form: 'form',
      default: 'input'
    };

    expect(components.$).toEqual(expected);
  });

  it('should successfully set and get a custom kind', () => {
    const components = new Components();

    components.set('enum', 'enumc');
    expect(components.get('enum')).toEqual('enumc');
  });

  it('should successfully get undefined kind', () => {
    const components = new Components();

    expect(components.get('enum')).toEqual('input');
  });
});
