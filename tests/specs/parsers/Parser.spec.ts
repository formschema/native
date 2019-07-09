import { Component } from 'vue';
import { Parser } from '@/parsers/Parser';
import { ScalarDescriptor, StringField, ParserOptions, ObjectDescriptor } from '@/types';
import { NativeDescriptor } from '@/lib/NativeDescriptor';
import { JsonSchema } from '@/types/jsonschema';

class FakeParser extends Parser<string, ScalarDescriptor, StringField> {
  parseValue(data: any): string {
    return data;
  }
}

class ObjectFakeParser extends Parser<string, ScalarDescriptor, StringField> {
  get type(): string {
    return 'object';
  }

  parseValue(data: any): any {
    return data || {};
  }
}

class InputFakeParser extends Parser<string, ScalarDescriptor, StringField> {
  get type(): string {
    return 'text';
  }

  parseValue(data: any): string {
    return data;
  }
}

function descriptorConstructorFaker({ type }: JsonSchema) {
  return type === 'object' ? {} : { kind: type };
}

describe('parsers/Parser', () => {
  describe('register and get', () => {
    it('Parser.get() should return `null` for undefined schema.type', () => {
      const options: any = {
        schema: { type: undefined } as any
      };

      const parser = Parser.get(options);

      expect(parser).toBe(null);
    });

    it('Parser.get() should throw an exception for unregister type', () => {
      const options: any = {
        schema: { type: 'unknow' } as any
      };

      expect(() => Parser.get(options)).toThrowError(TypeError);
    });

    it('Parser.get() should successfully return the registered parser', () => {
      const options: any = {
        schema: { type: 'string' },
        descriptorConstructor: descriptorConstructorFaker
      };

      Parser.register('string', InputFakeParser);
      expect(Parser.get(options)).toBeInstanceOf(InputFakeParser);
    });

    it('Parser.get() should successfully return the registered parser with its parent', () => {
      Parser.register('object', ObjectFakeParser);
      Parser.register('string', InputFakeParser);

      const schema: JsonSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      };

      const options: any = {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        },
        descriptorConstructor: descriptorConstructorFaker
      };

      const childOptions: any = {
        schema: options.schema.properties.name,
        descriptorConstructor: descriptorConstructorFaker
      };

      const parent: any = Parser.get(options);
      const child: any = Parser.get(childOptions, parent);

      expect(child).toBeInstanceOf(InputFakeParser);
      expect(child.parent).toBeInstanceOf(ObjectFakeParser);
    });
  });

  describe('instance with required options', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new FakeParser(options);

    describe('parser properties', () => {
      it('parser.isRoot should thruthy', () => {
        expect(parser.isRoot).toBeTruthy();
      });

      it('parser.isEnumItem should falsy', () => {
        expect(parser.isEnumItem).toBeFalsy();
      });

      it('parser.parent should be undefined', () => {
        expect(parser.parent).toBeUndefined();
      });

      it('parser.root should be defined', () => {
        expect(parser.root).toBeDefined();
      });

      it('parser.root should be equal to parser', () => {
        expect(parser.root).toEqual(parser);
      });

      it('parser.model should be equal to options.model', () => {
        expect(parser.model).toBe(options.model);
      });

      it('parser.rawValue should be equal to options.model', () => {
        expect(parser.rawValue).toBe(options.model);
      });

      it('parser.options should be equal to options', () => {
        expect(parser.options).toEqual(options);
      });

      it('parser.schema should be equal to options.schema', () => {
        expect(parser.schema).toEqual(options.schema);
      });

      it('parser.descriptor should be defined', () => {
        expect(parser.descriptor).toBeDefined();
      });

      it('parser.kind should be equal to options.schema.type', () => {
        expect(parser.kind).toBe(options.schema.type);
      });

      it('parser.type should be undefined', () => {
        expect(parser.type).toBeUndefined();
      });

      it('parser.id should defined', () => {
        expect(parser.id).toBeDefined();
      });

      it('parser.initialValue should be equal to options.model', () => {
        expect(parser.initialValue).toBe(options.model);
      });

      it('parser.field should be defined', () => {
        expect(parser.field).toBeDefined();
      });
    });

    describe('parser.field', () => {
      it('field.name should be undefined', () => {
        expect(parser.field.name).toBeUndefined();
      });

      it('field.kind should be equal to parser.kind', () => {
        expect(parser.field.kind).toBe(parser.kind);
      });

      it('field.isRoot should be truthy', () => {
        expect(parser.field.isRoot).toBeTruthy();
      });

      it('field.required should be truthy with scalar root schema', () => {
        expect(parser.field.required).toBeTruthy();
      });

      it('field.defaultValue should be undefined with undefined schema.default', () => {
        expect(parser.field.defaultValue).toBeUndefined();
      });

      it('field.defaultValue should be set to the default schema value', () => {
        const options: ParserOptions<any, ScalarDescriptor> = {
          schema: { type: 'string', default: 'Hello' },
          model: undefined,
          descriptorConstructor: NativeDescriptor.get
        };

        const parser = new FakeParser(options);

        expect(parser.field.defaultValue).toBe('Hello');
      });

      it('field.value should be empty', () => {
        expect(parser.field.value).toBe('');
      });

      it('field.value should be set to the default schema value', () => {
        const options: ParserOptions<any, ScalarDescriptor> = {
          schema: { type: 'string', default: 'Hello' },
          model: undefined,
          descriptorConstructor: NativeDescriptor.get
        };

        const parser = new FakeParser(options);

        expect(parser.field.value).toBe('Hello');
      });

      it('field.value should be undefined', () => {
        const options: ParserOptions<any, ScalarDescriptor> = {
          schema: { type: 'string' },
          model: undefined,
          descriptorConstructor: NativeDescriptor.get
        };

        const parser = new FakeParser(options);

        expect(parser.field.value).toBeUndefined();
      });

      it('field.value should have a worked setter', () => {
        parser.field.setValue('hello');
        expect(parser.field.value).toBe('hello');
      });

      it('field.attrs should be defined', () => {
        expect(parser.field.attrs).toBeDefined();
      });

      it('field.attrs should be have an initial input property', () => {
        expect(Object.keys(parser.field.attrs)).toEqual(['input', 'label', 'description']);
      });

      it('field.attrs.input should have minimal defined properties { id, type, name }', () => {
        expect(Object.keys(parser.field.attrs.input)).toEqual(['id', 'type', 'name']);
      });

      it('field.attrs.input.id should be defined', () => {
        expect(parser.field.attrs.input.id).toBeDefined();
      });

      it('field.attrs.input.type should be equal to parser.type', () => {
        expect(parser.field.attrs.input.type).toBe(parser.type);
      });

      it('field.attrs.input.name should be equal to options.name', () => {
        expect(parser.field.attrs.input.name).toBe(options.name);
      });

      it('field.attrs.label should be an empty object', () => {
        expect(parser.field.attrs.label).toEqual({});
      });

      it('field.attrs.description should be an empty object', () => {
        expect(parser.field.attrs.description).toEqual({});
      });

      it('field.props should be defined with an empty object', () => {
        expect(parser.field.props).toEqual({});
      });

      it('field.descriptor should be defined', () => {
        expect(parser.field.descriptor).toBeDefined();
      });

      it('field.descriptor should be a String Descriptor', () => {
        expect(parser.field.descriptor.kind).toBe('string');
      });

      it('field.component should be defined', () => {
        expect(parser.field.component).toBeDefined();
      });

      it('field.component should be an InputElement', () => {
        expect((parser.field.component as Component).name).toBe('InputElement');
      });

      it('field.parent should be undefined', () => {
        expect(parser.field.parent).toBeUndefined();
      });
    });

    describe('parser.parse()', () => {
      const options: ParserOptions<any, ScalarDescriptor> = {
        schema: { type: 'string' },
        model: '',
        descriptorConstructor: NativeDescriptor.get
      };

      const parser = new FakeParser(options);

      parser.parse();

      it('field.attrs should be have input, label and description labels', () => {
        expect(Object.keys(parser.field.attrs).sort()).toEqual([
          'input', 'label', 'description'
        ].sort());
      });

      it('field.attrs.input should have extended properties', () => {
        expect(Object.keys(parser.field.attrs.input).sort()).toEqual([
          'id', 'type', 'name', 'readonly', 'required',
          'aria-required', 'aria-describedby', 'aria-labelledby'
        ].sort());
      });

      it('field.attrs.input.type should be undefined', () => {
        expect(parser.field.attrs.input.type).toBeUndefined();
      });

      it('field.attrs.input.id should be defined', () => {
        expect(parser.field.attrs.input.id).toBeDefined();
      });

      it('field.attrs.input.readonly should be falsy', () => {
        expect(parser.field.attrs.input.readonly).toBeFalsy();
      });

      it('field.attrs.input.readonly should be truthy', () => {
        expect(parser.field.attrs.input.required).toBeTruthy();
      });

      it('field.attrs.label should be defined', () => {
        expect(parser.field.attrs.label).toBeDefined();
      });

      it('field.attrs.label.id should be undefined', () => {
        expect(parser.field.attrs.label.id).toBeUndefined();
      });

      it('field.attrs.label.for should be defined', () => {
        expect(parser.field.attrs.label.for).toBeDefined();
      });

      it('field.attrs.label.for should be equal to field.attrs.input.id', () => {
        expect(parser.field.attrs.label.for).toBe(parser.field.attrs.input.id);
      });

      it('field.attrs.description.id should be undefined', () => {
        expect(parser.field.attrs.description.id).toBeUndefined();
      });

      it('field.attrs.input.aria-required should be truthy', () => {
        expect(parser.field.attrs.input['aria-required']).toBe('true');
      });
    });
  });

  describe('instance with all defined options', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      id: 'input-id',
      descriptor: {
        kind: 'string',
        attrs: {},
        props: {},
        component: {
          name: 'TextInput'
        }
      },
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new FakeParser(options);

    describe('parser properties', () => {
      it('parser.initialValue should be equal to options.schema.default with undefined options.model', () => {
        expect(parser.initialValue).toBe(options.schema.default);
      });

      it('parser.model should be equal to parser.initialValue', () => {
        expect(parser.model).toBe(parser.initialValue);
      });

      it('parser.rawValue should be equal to parser.initialValue', () => {
        expect(parser.rawValue).toBe(parser.initialValue);
      });

      it('parser.descriptor should be equal to options.descriptor', () => {
        expect(parser.descriptor).toEqual(parser.descriptor);
      });

      it('parser.id should be equal to options.id', () => {
        expect(parser.id).toBe(options.id);
      });
    });
  });

  describe('schema with title', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: {
        type: 'string',
        title: 'Name'
      },
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new FakeParser(options);

    describe('parser properties', () => {
      it('should have provided schema', () => {
        expect(parser.schema).toEqual({
          type: 'string',
          title: 'Name'
        });
      });
    });

    describe('parser.parse()', () => {
      const parser = new FakeParser(options);

      parser.parse();

      it('field.attrs.label should have properties { id, for }', () => {
        expect(Object.keys(parser.field.attrs.label).sort()).toEqual([
          'for', 'id'
        ].sort());
      });

      it('field.attrs.label.id should be defined', () => {
        expect(parser.field.attrs.label.id).toBeDefined();
      });

      it('field.attrs.label.for should be equal to parser.field.attrs.input.id', () => {
        expect(parser.field.attrs.label.for).toBe(parser.field.attrs.input.id);
      });

      it('field.attrs.description should have properties { id }', () => {
        expect(Object.keys(parser.field.attrs.description).sort()).toEqual([
          'id'
        ].sort());
      });

      it('field.attrs.description.id should be undefined', () => {
        expect(parser.field.attrs.description.id).toBeUndefined();
      });
    });
  });

  describe('schema with title and description', () => {
    const options: ParserOptions<string, ScalarDescriptor> = {
      schema: {
        type: 'string',
        title: 'Name',
        description: 'Your First Name'
      },
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const parser = new FakeParser(options);

    describe('parser properties', () => {
      it('should have provided schema', () => {
        expect(parser.schema).toEqual({
          type: 'string',
          title: 'Name',
          description: 'Your First Name'
        });
      });
    });

    describe('parser.parse()', () => {
      const parser = new FakeParser(options);

      parser.parse();

      it('field.attrs.input should have extended properties', () => {
        expect(Object.keys(parser.field.attrs.input).sort()).toEqual([
          'id', 'type', 'name', 'readonly', 'required',
          'aria-required', 'aria-describedby', 'aria-labelledby'
        ].sort());
      });

      it('field.attrs.label should have properties { id, for }', () => {
        expect(Object.keys(parser.field.attrs.label).sort()).toEqual([
          'for', 'id'
        ].sort());
      });

      it('field.attrs.label.id should be defined', () => {
        expect(parser.field.attrs.label.id).toBeDefined();
      });

      it('field.attrs.label.for should be equal to parser.field.attrs.input.id', () => {
        expect(parser.field.attrs.label.for).toBe(parser.field.attrs.input.id);
      });

      it('field.attrs.description should have properties { id }', () => {
        expect(Object.keys(parser.field.attrs.description).sort()).toEqual([
          'id'
        ].sort());
      });

      it('field.attrs.description.id should be defined', () => {
        expect(parser.field.attrs.description.id).toBeDefined();
      });
    });
  });

  describe('with an object schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    };

    const parentOptions: ParserOptions<string, ObjectDescriptor> = {
      schema: schema as JsonSchema,
      model: '',
      descriptorConstructor: NativeDescriptor.get
    };

    const childOptions: ParserOptions<string, ScalarDescriptor> = {
      schema: schema.properties.name as JsonSchema,
      name: 'name',
      model: 'Jon Snow',
      descriptorConstructor: NativeDescriptor.get
    };

    const parent = new ObjectFakeParser(parentOptions);
    const parser = new InputFakeParser(childOptions, parent);

    describe('parser properties', () => {
      it('parent should have a defined type', () => {
        expect(parent.type).toBe('object');
      });

      it('child should have a defined type', () => {
        expect(parser.type).toBe('text');
      });
    });

    describe('parser.field', () => {
      it('field.name should be defined', () => {
        expect(parser.field.name).toBe('name');
      });

      it('field.isRoot should be falsy', () => {
        expect(parser.field.isRoot).toBeFalsy();
      });

      it('field.required should be falsy with missing object parent schema.required', () => {
        expect(parser.field.required).toBeFalsy();
      });

      it('field.rawValue should have the default value', () => {
        expect(parser.field.rawValue).toBe('Jon Snow');
      });

      it('field.value should have the default value', () => {
        expect(parser.field.value).toBe('Jon Snow');
      });

      it('field.value should have a worked setter', () => {
        parser.field.setValue('Tyrion Lannister');
        expect(parser.field.value).toBe('Tyrion Lannister');
      });

      it('parent.field.value should update with child\'s setter', () => {
        parser.field.setValue('Arya Stark');
        expect(parent.field.value).toEqual({});
      });

      it('field.attrs.input should have minimal defined properties { id, type, name }', () => {
        expect(Object.keys(parser.field.attrs.input)).toEqual(['id', 'type', 'name']);
      });

      it('field.attrs.input.id should be defined', () => {
        expect(parser.field.attrs.input.id).toBeDefined();
      });

      it('field.attrs.input.type should be equal to parser.type', () => {
        expect(parser.field.attrs.input.type).toBe(parser.type);
      });

      it('field.attrs.input.name should be equal to options.name', () => {
        expect(parser.field.attrs.input.name).toBe(childOptions.name);
      });

      it('field.parent should be defined', () => {
        expect(parser.field.parent).toBeDefined();
      });
    });

    describe('parser.parse()', () => {
      const parent = new ObjectFakeParser(parentOptions);
      const parser = new InputFakeParser(childOptions, parent);

      parser.parse();
      parent.parse();

      it('field.attrs should be have input, label and description labels', () => {
        expect(Object.keys(parser.field.attrs).sort()).toEqual([
          'input', 'label', 'description'
        ].sort());
      });

      it('field.attrs.input should have extended properties', () => {
        expect(Object.keys(parser.field.attrs.input).sort()).toEqual([
          'id', 'type', 'name', 'readonly', 'required',
          'aria-describedby', 'aria-labelledby'
        ].sort());
      });

      it('field.attrs.input.type should be defined', () => {
        expect(parser.field.attrs.input.type).toBe('text');
      });

      it('field.attrs.input.id should be defined', () => {
        expect(parser.field.attrs.input.id).toBeDefined();
      });

      it('field.attrs.input.readonly should be falsy', () => {
        expect(parser.field.attrs.input.readonly).toBeFalsy();
      });

      it('field.attrs.input.readonly should be falsy', () => {
        expect(parser.field.attrs.input.required).toBeFalsy();
      });
    });
  });

  it('parser.defaultComponent with missing descriptor.component should be undefined', () => {
    const options: ParserOptions<any, ScalarDescriptor> = {
      schema: { type: 'string' },
      model: undefined,
      descriptor: {
        attrs: {},
        props: {},
        labels: {}
      },
      descriptorConstructor: NativeDescriptor.get
    };

    const parser: any = new InputFakeParser(options);

    delete parser.field.descriptor.kind;

    expect(parser.defaultComponent).toBeUndefined();
  });
});
