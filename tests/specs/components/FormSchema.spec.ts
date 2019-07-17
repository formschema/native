import Vue from 'vue';
import FormSchema, { GLOBAL, UniqueId, Objects, Components, Parser } from '@/components/FormSchema';

import { mount } from '@vue/test-utils';
import { JsonSchema } from '@/types/jsonschema';

import { UniqueId as UniqueIdLib } from '@/lib/UniqueId';
import { Objects as ObjectsLib } from '@/lib/Objects';
import { Components as ComponentsLib } from '@/lib/Components';
import { Parser as ParserLib } from '@/parsers/Parser';

import { NativeElements } from '@/lib/NativeElements';
import { NativeDescriptor } from '@/lib/NativeDescriptor';

const DEFAULT_ID = 'id-form';

function getWrapper(options: any) {
  const { id = DEFAULT_ID, schema, value, children, ...props }: any = options;

  return mount({
    functional: true,
    render(h: Function) {
      return h(FormSchema, {
        props: {
          id, value, schema, ...props
        }
      }, children);
    }
  });
}

const schema: JsonSchema = {
  type: 'string',
  title: 'String',
  description: 'A String'
};

describe('components/FormSchema', () => {
  describe('exported libraries', () => {
    it('should successfully export the GLOBAL.Elements library', () => {
      expect(GLOBAL.Elements).toBe(NativeElements);
    });

    it('should successfully export the GLOBAL.Descriptor library', () => {
      expect(GLOBAL.Descriptor).toBe(NativeDescriptor);
    });

    it('should successfully export the UniqueId library', () => {
      expect(UniqueId).toBe(UniqueIdLib);
    });

    it('should successfully export the Objects library', () => {
      expect(Objects).toBe(ObjectsLib);
    });

    it('should successfully export the Components library', () => {
      expect(Components).toBe(ComponentsLib);
    });

    it('should successfully export the Parser library', () => {
      expect(Parser).toBe(ParserLib);
    });
  });

  describe('props/computed', () => {
    it('should have setted schema', (done) => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      Vue.nextTick(() => {
        expect(vm.schema).toBe(schema);
        done();
      });
    });

    it('vm.id should be defined', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.id).toBeDefined();
    });

    it('vm.name should be defined', () => {
      const name = 'string';
      const wrapper = getWrapper({ schema, name });
      const vm: any = wrapper.vm;

      expect(vm.name).toBeDefined();
    });

    it('vm.bracketedObjectInputName should be defined', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.bracketedObjectInputName).toBeTruthy();
    });

    it('vm.search should be defined', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.search).toBeFalsy();
    });

    it('vm.disabled should be defined', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.disabled).toBeFalsy();
    });

    it('vm.components should be defined', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.components).toBeDefined();
    });

    it('vm.descriptor should be defined', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.descriptor).toBeDefined();
    });

    it('vm.fieldId should be defined', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.fieldId).toBeDefined();
    });
  });

  describe('should successfully render component', () => {
    it('as an undefined VNode when before the nextTick', () => {
      const wrapper = getWrapper({ schema });
      const vm: any = wrapper.vm;

      expect(vm.ready).toBeFalsy();
      expect(wrapper.html()).toBeUndefined();
    });

    it('after the nextTick', () => {
      const wrapper = getWrapper({ schema });
      const expected = '<form id="id-form"><div data-fs-kind="string" data-fs-required="true"><label id="id-form-field-label" for="id-form-field">String</label><div data-fs-input="text"><input id="id-form-field" type="text" required="required" aria-required="true" aria-labelledby="id-form-field-label" aria-describedby="id-form-field-helper"><p id="id-form-field-helper">A String</p></div></div></form>';

      return Vue.nextTick().then(() => {
        const vm: any = wrapper.vm;

        expect(vm.ready).toBeTruthy();
        expect(wrapper.html()).toBe(expected);
      });
    });

    it('should emit an input event with an undefined model', () => {
      const wrapper = getWrapper({ schema });

      expect(Object.keys(wrapper.emitted())).toEqual(['input']);
      expect(wrapper.emitted().input).toEqual([[undefined]]);
    });

    it('should emit an input event with a defined model', () => {
      const value = 'gohan';
      const wrapper = getWrapper({ schema, value });

      expect(Object.keys(wrapper.emitted())).toEqual(['input']);
      expect(wrapper.emitted().input).toEqual([[value]]);
    });

    it('as an undefined VNode with an undefined schema.type', () => {
      const wrapper = getWrapper({ schema: { ...schema, type: undefined } });

      expect(wrapper.html()).toBeUndefined();
    });

    it('with a default slot', () => {
      const children = 'checking...'
      const wrapper = getWrapper({ schema, children });
      const expected = '<form id="id-form"><div data-fs-kind="string" data-fs-required="true"><label id="id-form-field-label" for="id-form-field">String</label><div data-fs-input="text"><input id="id-form-field" type="text" required="required" aria-required="true" aria-labelledby="id-form-field-label" aria-describedby="id-form-field-helper"><p id="id-form-field-helper">A String</p></div></div>checking...</form>';

      return Vue.nextTick().then(() => expect(wrapper.html()).toBe(expected));
    });

    it('with only a scalar schema', () => {
      const wrapper = getWrapper({ schema });
      const expected = '<form id="id-form"><div data-fs-kind="string" data-fs-required="true"><label id="id-form-field-label" for="id-form-field">String</label><div data-fs-input="text"><input id="id-form-field" type="text" required="required" aria-required="true" aria-labelledby="id-form-field-label" aria-describedby="id-form-field-helper"><p id="id-form-field-helper">A String</p></div></div></form>';

      return Vue.nextTick().then(() => expect(wrapper.html()).toBe(expected));
    });

    it('with only a non scalar schema', (done) => {
      const objectSchema = {
        type: 'object',
        properties: {
          string: schema
        }
      };

      const wrapper = getWrapper({ schema: objectSchema });
      const expected = { id: 'id-form' };

      Vue.nextTick(() => {
        expect(wrapper.attributes()).toEqual(expected);
        done();
      });
    });

    it('with { schema, search }', (done) => {
      const search = true;
      const wrapper = getWrapper({ schema, search });
      const expected = { id: 'id-form', role: 'search' };

      Vue.nextTick(() => {
        expect(wrapper.attributes()).toEqual(expected);
        done();
      });
    });

    it('with { schema, disabled }', (done) => {
      const disabled = true;
      const wrapper = getWrapper({ schema, disabled });
      const expected = { id: 'id-form' };

      Vue.nextTick(() => {
        expect(wrapper.attributes()).toEqual(expected);
        done();
      });
    });
  });

  describe('vm.clone(value)', () => {
    const wrapper = getWrapper({ schema });

    it('should successfully clone a scalar value', () => {
      Vue.nextTick(() => {
        const vm: any = wrapper.find('form').vm;

        expect(vm.clone(12)).toBe(12);
      });
    });

    it('should successfully clone an array value', () => {
      Vue.nextTick(() => {
        const vm: any = wrapper.find('form').vm;

        expect(vm.clone([12])).toEqual([12]);
        expect(vm.clone([12]) !== [12]).toBeTruthy();
      });
    });

    it('should successfully clone an object value', () => {
      Vue.nextTick(() => {
        const vm: any = wrapper.find('form').vm;

        expect(vm.clone({a:12})).toEqual({a:12});
        expect(vm.clone({a:12}) !== {a:12}).toBeTruthy();
      });
    });
  });

  it('vm.form() should be return a defined VNode', (done) => {
    const wrapper = getWrapper({ schema });

    Vue.nextTick(() => {
      const vm: any = wrapper.find('form').vm;

      expect(vm.form()).toBeDefined();
      done();
    });
  });

  it('vm.update(updatedFields) should be called', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        credit_card: {
          type: 'number'
        },
        billing_address: {
          type: 'string'
        }
      },
      dependencies: {
        credit_card: [
          'billing_address'
        ]
      }
    };

    const wrapper = getWrapper({ schema });
    const vm: any = wrapper.vm;
    const previousKey = vm.key;

    vm.update = jest.fn();
    vm.parser.field.children[0].input.setValue(123);

    expect(vm.key).not.toBe(previousKey);
  });
});
