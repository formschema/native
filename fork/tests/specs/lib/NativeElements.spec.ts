import { NativeElements } from '@/lib/NativeElements';

const items = [
  { kind: 'array', name: 'ArrayElement' },
  { kind: 'boolean', name: 'InputElement' },
  { kind: 'string', name: 'InputElement' },
  { kind: 'radio', name: 'InputElement' },
  { kind: 'enum', name: 'FieldsetElement' },
  { kind: 'number', name: 'InputElement' },
  { kind: 'integer', name: 'InputElement' },
  { kind: 'object', name: 'FieldsetElement' },
  { kind: 'list', name: 'ListElement' },
  { kind: 'textarea', name: 'TextareaElement' }
];

describe('lib/NativeElements', () => {
  items.forEach(({ kind, name }) => {
    const component: any = NativeElements.get(kind as any);

    it(`component for kind '${kind}' should be '${name}'`, () => {
      expect(component.name).toBe(name);
    });
  });
});
