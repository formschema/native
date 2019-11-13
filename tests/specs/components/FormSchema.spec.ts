/* eslint-disable @typescript-eslint/camelcase */

import Vue from 'vue';

import { mount } from '@vue/test-utils';

import FormSchema, {
  GLOBAL,
  UniqueId,
  Objects,
  Components,
  Fieldset,
  Parser,
  UIDescriptor,
  NativeComponents
} from '@/components/FormSchema';

import { JsonSchema } from '@/types/jsonschema';

import { UniqueId as UniqueIdLib } from '@/lib/UniqueId';
import { Objects as ObjectsLib } from '@/lib/Objects';
import { Components as ComponentsLib } from '@/lib/Components';
import { NativeComponents as NativeComponentsLib } from '@/lib/NativeComponents';
import { Fieldset as FieldsetLib } from '@/lib/Fieldset';
import { Parser as ParserLib } from '@/parsers/Parser';
import { UIDescriptor as UIDescriptorLib } from '@/descriptors/UIDescriptor';

import { NativeElements } from '@/lib/NativeElements';

const DEFAULT_ID = 'id-form';

function getWrapper(options: any): any {
  const {
    id = DEFAULT_ID, schema, value, children, ...props
  }: any = options;

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
    it('should successfully export the GLOBAL.Fieldset library', () => {
      expect(GLOBAL.Elements).toBe(NativeElements);
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

    it('should successfully export the NativeComponents library', () => {
      expect(NativeComponents).toBe(NativeComponentsLib);
    });

    it('should successfully export the Fieldset library', () => {
      expect(Fieldset).toBe(FieldsetLib);
    });

    it('should successfully export the Parser library', () => {
      expect(Parser).toBe(ParserLib);
    });

    it('should successfully export the UIDescriptor library', () => {
      expect(UIDescriptor).toBe(UIDescriptorLib);
    });
  });

  describe('props/computed', () => {
    it('should have setted schema', (done) => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      Vue.nextTick(() => {
        expect(vm.schema).toBe(schema);
        done();
      });
    });

    it('vm.id should be defined', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.id).toBeDefined();
    });

    it('vm.name should be defined', () => {
      const name = 'string';
      const wrapper = getWrapper({ schema, name });
      const { vm } = wrapper;

      expect(vm.name).toBeDefined();
    });

    it('vm.bracketedObjectInputName should be defined', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.bracketedObjectInputName).toBeTruthy();
    });

    it('vm.search should be defined', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.search).toBeFalsy();
    });

    it('vm.disabled should be defined', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.disabled).toBeFalsy();
    });

    it('vm.components should be defined', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.components).toBeDefined();
    });

    it('vm.descriptor should be an empty object', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.descriptor).toEqual({});
    });

    it('vm.fieldId should be defined', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.fieldId).toBeDefined();
    });
  });

  describe('should successfully render component', () => {
    it('as an undefined VNode when before the nextTick', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.ready).toBeFalsy();
      expect(wrapper.html()).toBeUndefined();
    });

    it('after the nextTick', () => {
      const wrapper = getWrapper({ schema });
      const expected = '<form id="id-form"><div data-fs-kind="string" data-fs-type="text" data-fs-required="true"><label id="id-form-field-label" for="id-form-field">String</label><div data-fs-wrapper="2"><div data-fs-input="text"><input id="id-form-field" type="text" required="required" aria-required="true" aria-labelledby="id-form-field-label" aria-describedby="id-form-field-helper"></div><p id="id-form-field-helper" data-fs-helper="true">A String</p></div></div></form>';

      return Vue.nextTick().then(() => {
        const { vm } = wrapper;

        expect(vm.ready).toBeTruthy();
        expect(wrapper.html()).toMatchSnapshot(expected);
      });
    });

    it('should emit an input event with an undefined model', () => {
      const wrapper = getWrapper({ schema });

      expect(Object.keys(wrapper.emitted())).toEqual([ 'input' ]);
      expect(wrapper.emitted().input).toEqual([ [ undefined ] ]);
    });

    it('should emit an input event with a defined model', () => {
      const value = 'gohan';
      const wrapper = getWrapper({ schema, value });

      expect(Object.keys(wrapper.emitted())).toEqual([ 'input' ]);
      expect(wrapper.emitted().input).toEqual([ [ value ] ]);
    });

    it('as an undefined VNode with an undefined schema.type', () => {
      const wrapper = getWrapper({ schema: { ...schema, type: undefined } });

      expect(wrapper.html()).toBeUndefined();
    });

    it('with a default slot', () => {
      const children = 'checking...';
      const wrapper = getWrapper({ schema, children });
      const expected = '<form id="id-form"><div data-fs-kind="string" data-fs-type="text" data-fs-required="true"><label id="id-form-field-label" for="id-form-field">String</label><div data-fs-wrapper="2"><div data-fs-input="text"><input id="id-form-field" type="text" required="required" aria-required="true" aria-labelledby="id-form-field-label" aria-describedby="id-form-field-helper"></div><p id="id-form-field-helper" data-fs-helper="true">A String</p></div></div>checking...</form>';

      return Vue.nextTick().then(() => expect(wrapper.html()).toMatchSnapshot(expected));
    });

    it('with only a scalar schema', () => {
      const wrapper = getWrapper({ schema });
      const expected = '<form id="id-form"><div data-fs-kind="string" data-fs-type="text" data-fs-required="true"><label id="id-form-field-label" for="id-form-field">String</label><div data-fs-wrapper="2"><div data-fs-input="text"><input id="id-form-field" type="text" required="required" aria-required="true" aria-labelledby="id-form-field-label" aria-describedby="id-form-field-helper"></div><p id="id-form-field-helper" data-fs-helper="true">A String</p></div></div></form>';

      return Vue.nextTick().then(() => expect(wrapper.html()).toMatchSnapshot(expected));
    });

    it('with a non scalar schema', (done) => {
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
      const objectSchema = {
        type: 'object',
        properties: {
          string: schema
        }
      };

      const wrapper = getWrapper({ schema: objectSchema, disabled: true });
      const expected = '<form id="id-form"><fieldset id="id-form-field" disabled="disabled"><div data-fs-kind="string" data-fs-type="text" data-fs-field="string"><label id="id-form-field-string-label" for="id-form-field-string">String</label><div data-fs-wrapper="2"><div data-fs-input="text"><input id="id-form-field-string" type="text" name="string" aria-labelledby="id-form-field-string-label" aria-describedby="id-form-field-string-helper"></div><span id="id-form-field-string-helper" data-fs-helper="true">A String</span></div></div></fieldset></form>';

      Vue.nextTick(() => {
        expect(wrapper.html()).toMatchSnapshot(expected);
        done();
      });
    });
  });

  it('vm.form() should be return a defined VNode', (done) => {
    const wrapper = getWrapper({ schema });

    Vue.nextTick(() => {
      const { vm } = wrapper.find('form');

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
    const { vm } = wrapper;
    const previousKey = vm.key;

    vm.update = jest.fn();
    vm.parser.field.children.credit_card.setValue(123);

    expect(vm.key).not.toBe(previousKey);
  });
});
