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

import { UniqueId as UniqueIdLib } from '@/lib/UniqueId';
import { Objects as ObjectsLib } from '@/lib/Objects';
import { Components as ComponentsLib } from '@/lib/Components';
import { NativeComponents as NativeComponentsLib } from '@/lib/NativeComponents';
import { Fieldset as FieldsetLib } from '@/lib/Fieldset';
import { Parser as ParserLib } from '@/parsers/Parser';
import { UIDescriptor as UIDescriptorLib } from '@/descriptors/UIDescriptor';

import { NativeElements } from '@/lib/NativeElements';
import { JsonSchema } from '../../../types/jsonschema';

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
    it('should have setted schema', async () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      await Vue.nextTick();
      expect(vm.schema).toBe(schema);
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
    it('as an empty VNode when before the nextTick', () => {
      const wrapper = getWrapper({ schema });
      const { vm } = wrapper;

      expect(vm.ready).toBeFalsy();
      expect(wrapper.html()).toBe('');
    });

    it('after the nextTick', () => {
      const wrapper = getWrapper({ schema });

      return Vue.nextTick().then(() => {
        const { vm } = wrapper;

        expect(vm.ready).toBeTruthy();
        expect(wrapper.html()).toMatchSnapshot();
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

    it('as an empty VNode with an undefined schema.type', () => {
      const wrapper = getWrapper({ schema: { ...schema, type: undefined } });

      expect(wrapper.html()).toBe('');
    });

    it('with a default slot', () => {
      const children = 'checking...';
      const wrapper = getWrapper({ schema, children });

      return Vue.nextTick().then(() => expect(wrapper.html()).toMatchSnapshot());
    });

    it('with only a scalar schema', () => {
      const wrapper = getWrapper({ schema });

      return Vue.nextTick().then(() => expect(wrapper.html()).toMatchSnapshot());
    });

    it('with a non scalar schema', async () => {
      const objectSchema = {
        type: 'object',
        properties: {
          string: schema
        }
      };

      const wrapper = getWrapper({ schema: objectSchema });
      const expected = { id: 'id-form' };

      await Vue.nextTick();
      expect(wrapper.attributes()).toEqual(expected);
    });

    it('with an object schema by using default schema ordering', async () => {
      const wrapper = getWrapper({
        schema: {
          type: 'object',
          properties: {
            lastname: schema,
            firstname: schema
          }
        }
      });

      await Vue.nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('with an object schema by using explicit ordering fields', async () => {
      const wrapper = getWrapper({
        schema: {
          type: 'object',
          properties: {
            lastname: schema,
            firstname: schema
          }
        },
        descriptor: {
          order: [ 'firstname', 'lastname' ]
        }
      });

      await Vue.nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('with { schema, search }', async () => {
      const search = true;
      const wrapper = getWrapper({ schema, search });
      const expected = { id: 'id-form', role: 'search' };

      await Vue.nextTick();
      expect(wrapper.attributes()).toEqual(expected);
    });

    it('with { schema, disabled }', async () => {
      const objectSchema = {
        type: 'object',
        properties: {
          string: schema
        }
      };

      const wrapper = getWrapper({ schema: objectSchema, disabled: true });

      await Vue.nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  it('vm.form() should be return a defined VNode', async () => {
    const wrapper = getWrapper({ schema });

    await Vue.nextTick();

    const form = wrapper.find('form');

    expect(form.vm.form()).toBeDefined();
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
    vm.parser.field.fields.credit_card.setValue(123);

    expect(vm.key).not.toBe(previousKey);
  });
});
