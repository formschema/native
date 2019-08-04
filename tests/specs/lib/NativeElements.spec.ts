import { NativeElements } from '@/lib/NativeElements';

const items: any = {
  array: 'ArrayElement',
  boolean: 'StateElement',
  string: 'InputElement',
  file: 'InputElement',
  image: 'InputElement',
  radio: 'StateElement',
  checkbox: 'StateElement',
  enum: 'FieldsetElement',
  number: 'InputElement',
  integer: 'InputElement',
  object: 'FieldsetElement',
  list: 'ListElement',
  textarea: 'TextareaElement'
};

describe('lib/NativeElements', () => {
  Object.keys(NativeElements.$).forEach((kind: any) => {
    const name = items[kind];
    const component: any = NativeElements.get(kind);

    it(`component for kind '${kind}' should be equal to '${name}'`, () => {
      expect(component.name).toBe(name);
    });
  });

  it('component for kind form should have native form element', () => {
    expect(NativeElements.get('form')).toBe('form');
  });

  it('getting an unknow kind should return the native input element', () => {
    expect(NativeElements.get('unknow' as any)).toBe('input');
  });
});
