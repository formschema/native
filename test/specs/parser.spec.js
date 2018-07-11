'use strict'

import {
  s4,
  genId,
  setCommonFields,
  parseDefaultScalarValue,
  parseEventValue,
  parseDefaultObjectValue,
  setItemName,
  arrayOrderedValues,
  arrayUnorderedValues,
  singleValue,
  parseBoolean,
  parseString,
  parseItems,
  parseArray,
  loadFields
} from '@/lib/parser'

/* global describe it expect */

describe('lib/parser', () => {
  describe('s4()', () => {
    it('should return a string value', () => {
      expect(typeof s4()).toEqual('string')
    })

    it('should return a string value with length = 4', () => {
      expect(s4().length).toEqual(4)
    })
  })

  describe('genId(prefix = "")', () => {
    it('should successfully generate ID', () => {
      expect(genId().length).toEqual(8)
    })

    it('should successfully generate ID with a prefix', () => {
      expect(genId('id-').startsWith('id-')).toBeTruthy()
    })
  })

  describe('setCommonFields(schema, field)', () => {
    it('should successfully set common fields with default values', () => {
      const field = { attrs: {} }
      const schema = { type: 'string' }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          required: false,
          disabled: false
        }
      }

      setCommonFields(schema, field)

      expect(typeof field.attrs.id).toEqual('string')

      delete field.attrs.id

      expect(field).toEqual(expected)
    })

    it('should successfully set common fields with filled schema', () => {
      const field = { attrs: { id: 'x', value: 'value' } }
      const schema = {
        type: 'string',
        title: 'title value',
        description: 'description value',
        required: true,
        disabled: true
      }
      const expected = {
        schemaType: 'string',
        label: 'title value',
        description: 'description value',
        attrs: {
          id: 'x',
          value: 'value',
          required: true,
          disabled: true
        }
      }

      setCommonFields(schema, field)

      expect(field).toEqual(expected)
    })

    it('should successfully set common fields with default schema value', () => {
      const field = { attrs: {} }
      const schema = {
        type: 'string',
        default: 'value'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          value: 'value',
          required: false,
          disabled: false
        }
      }

      setCommonFields(schema, field)

      delete field.attrs.id

      expect(field).toEqual(expected)
    })

    it('should successfully set common fields with default true value', () => {
      const field = { attrs: {} }
      const schema = {
        type: 'boolean',
        default: true
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          value: true,
          required: false,
          disabled: false
        }
      }

      setCommonFields(schema, field)

      delete field.attrs.id

      expect(field).toEqual(expected)
    })

    it('should successfully set common fields with default false value', () => {
      const field = { attrs: {} }
      const schema = {
        type: 'boolean',
        default: false
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          value: false,
          required: false,
          disabled: false
        }
      }

      setCommonFields(schema, field)

      delete field.attrs.id

      expect(field).toEqual(expected)
    })

    it('should successfully set common fields with default 0 value', () => {
      const field = { attrs: {} }
      const schema = {
        type: 'number',
        default: 0
      }
      const expected = {
        schemaType: 'number',
        label: '',
        description: '',
        attrs: {
          value: 0,
          required: false,
          disabled: false
        }
      }

      setCommonFields(schema, field)

      delete field.attrs.id

      expect(field).toEqual(expected)
    })
  })

  describe('setItemName(field)', () => {
    it('should successfully set the item names', () => {
      const name = 'field-name'
      const items = [
        { name: 'item1', label: 'label 0', value: 0 },
        { label: 'label 1', value: 1 }
      ]
      const expected = [
        { name: 'item1', label: 'label 0', value: 0, ref: `${name}-0` },
        { name: 'field-name-label-1', label: 'label 1', value: 1, ref: `${name}-1` }
      ]
      const result = items.map(setItemName(name))

      result.forEach((item) => expect(typeof item.id).toEqual('string'))
      result.forEach((item) => delete item.id)

      expect(result).toEqual(expected)
    })

    it('should successfully set the item names with the missing field name', () => {
      const name = undefined
      const items = [
        { name: 'item1', label: 'label 0', value: 0 },
        { label: 'label 1', value: 1 }
      ]
      const expected = [
        { name: 'item1', label: 'label 0', value: 0 },
        { name: 'label-1', label: 'label 1', value: 1 }
      ]
      const result = items.map(setItemName(name))

      result.forEach((item) => expect(typeof item.id).toEqual('string'))
      result.forEach((item) => delete item.id)

      expect(result).toEqual(expected)
    })

    it('should successfully set the item names with isRadio === true', () => {
      const name = 'radio-field-name'
      const items = [
        { name: 'item1', label: 'label 0', value: 0 },
        { label: 'label 1', value: 1 }
      ]
      const expected = [
        { name, label: 'label 0', value: 0, ref: `${name}-0` },
        { name, label: 'label 1', value: 1, ref: `${name}-1` }
      ]
      const result = items.map(setItemName(name, true))

      result.forEach((item) => expect(typeof item.id).toEqual('string'))
      result.forEach((item) => delete item.id)

      expect(result).toEqual(expected)
    })
  })

  describe('arrayOrderedValues(field)', () => {
    it('should return the right array values', () => {
      const field = {
        items: [
          { label: 'l0', value: 0 },
          { label: 'l1', value: 1, checked: true },
          { label: 'l2', value: 2, checked: false }
        ]
      }
      const expected = [undefined, 1, undefined]

      expect(arrayOrderedValues(field)).toEqual(expected)
    })
  })

  describe('arrayUnorderedValues(field)', () => {
    it('should return the right array values', () => {
      const field = {
        items: [
          { label: 'l0', value: 0 },
          { label: 'l1', value: 1, checked: true },
          { label: 'l2', value: 2, checked: false },
          { label: 'l3', value: 3, selected: true }
        ]
      }
      const expected = [1, 3]

      expect(arrayUnorderedValues(field)).toEqual(expected)
    })
  })

  describe('singleValue(field)', () => {
    it('should return the last selected value', () => {
      const field = {
        items: [
          { label: 'l0', value: 0 },
          { label: 'l1', value: 1, checked: true },
          { label: 'l2', value: 2, checked: false },
          { label: 'l3', value: 3, selected: false }
        ]
      }
      const expected = 1

      expect(singleValue(field)).toEqual(expected)
    })
  })

  describe('parseBoolean(schema, name = null)', () => {
    it('should successfully parse an empty schema', () => {
      const schema = { type: 'boolean' }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          type: 'checkbox',
          checked: false,
          required: false,
          disabled: false
        }
      }

      const result = parseBoolean(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with custom input type', () => {
      const schema = {
        type: 'boolean',
        attrs: {
          type: 'radio'
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          type: 'radio',
          checked: false,
          required: false,
          disabled: false
        }
      }

      const result = parseBoolean(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined checked falsely value', () => {
      const schema = {
        type: 'boolean',
        attrs: {
          type: 'radio',
          checked: false
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'radio',
          checked: false,
          required: false,
          disabled: false
        }
      }

      const result = parseBoolean(schema, 'name')

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined default value', () => {
      const schema = {
        type: 'boolean',
        default: true,
        attrs: {
          type: 'radio'
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'radio',
          checked: true,
          required: false,
          disabled: false
        }
      }

      const result = parseBoolean(schema, 'name')

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined input name', () => {
      const schema = {
        type: 'boolean',
        attrs: {
          type: 'radio'
        }
      }
      const expected = {
        schemaType: 'boolean',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'radio',
          checked: false,
          required: false,
          disabled: false
        }
      }

      const result = parseBoolean(schema, 'name')

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })
  })

  describe('parseString(schema, name = null)', () => {
    it('should successfully parse an empty schema', () => {
      const schema = { type: 'string' }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'text',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with custom input type', () => {
      const schema = {
        type: 'string',
        attrs: {
          type: 'file'
        }
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'file',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined input name', () => {
      const schema = {
        type: 'string',
        attrs: {
          type: 'file'
        }
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          name: 'name',
          type: 'file',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema, 'name')

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with filled schema', () => {
      const schema = {
        type: 'string',
        minLength: 2,
        maxLength: 5,
        pattern: '[a-z]+'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'text',
          minlength: 2,
          maxlength: 5,
          pattern: '[a-z]+',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined format.email', () => {
      const schema = {
        type: 'string',
        format: 'email'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'email',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)

      schema.attrs = { type: 'text' }
      expected.attrs.type = 'text'

      const result2 = parseString(schema)

      expect(typeof result2.attrs.id).toEqual('string')
      delete result2.attrs.id

      expect(result2).toEqual(expected)
    })

    it('should successfully parse with defined format.uri', () => {
      const schema = {
        type: 'string',
        format: 'uri'
      }
      const expected = {
        schemaType: 'string',
        label: '',
        description: '',
        attrs: {
          type: 'url',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)

      schema.attrs = { type: 'text' }
      expected.attrs.type = 'text'

      const result2 = parseString(schema)

      expect(typeof result2.attrs.id).toEqual('string')
      delete result2.attrs.id

      expect(result2).toEqual(expected)
    })

    it('should successfully parse with schema.type === number', () => {
      const schema = { type: 'number' }
      const expected = {
        schemaType: 'number',
        label: '',
        description: '',
        attrs: {
          type: 'number',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with schema.type === integer', () => {
      const schema = { type: 'integer' }
      const expected = {
        schemaType: 'integer',
        label: '',
        description: '',
        attrs: {
          type: 'number',
          required: false,
          disabled: false
        }
      }

      const result = parseString(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })
  })

  describe('parseItems(items)', () => {
    it('should successfully parse array with object items', () => {
      const items = [{ value: 'v', label: 'l' }]

      expect(parseItems(items)).toEqual(items)
    })

    it('should successfully parse array with non object items', () => {
      const items = ['a', 'b']
      const expected = [
        { value: 'a', label: 'a' },
        { value: 'b', label: 'b' }
      ]

      expect(parseItems(items)).toEqual(expected)
    })
  })

  describe('parseArray(schema, name = null)', () => {
    it('should successfully parse an empty schema', () => {
      const schema = { type: 'array' }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 1,
        maxItems: 1000,
        attrs: {
          type: 'text',
          required: false,
          disabled: false
        }
      }

      const result = parseArray(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with custom input type', () => {
      const schema = {
        type: 'array',
        attrs: {
          type: 'file'
        }
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 1,
        maxItems: 1000,
        attrs: {
          type: 'file',
          required: false,
          disabled: false
        }
      }

      const result = parseArray(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with number type', () => {
      const schema = {
        type: 'array',
        items: {
          type: 'number'
        }
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 1,
        maxItems: 1000,
        attrs: {
          type: 'number',
          required: false,
          disabled: false
        }
      }

      const result = parseArray(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined input name', () => {
      const schema = { type: 'array' }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 1,
        maxItems: 1000,
        attrs: {
          name: 'name',
          type: 'text',
          required: false,
          disabled: false
        }
      }

      const result = parseArray(schema, 'name')

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with filled schema', () => {
      const schema = {
        type: 'array',
        minItems: 2,
        maxItems: 5,
        attrs: {
          type: 'select'
        }
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        items: [],
        minItems: 2,
        maxItems: 5,
        attrs: {
          type: 'select',
          value: [],
          required: false,
          disabled: false,
          multiple: true
        }
      }

      const result = parseArray(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined schema.enum', () => {
      const schema = {
        type: 'array',
        enum: [{ value: 'v', label: 'l' }],
        attrs: {
          type: 'text'
        }
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        minItems: 1,
        maxItems: 1000,
        items: [{ value: 'v', label: 'l' }],
        attrs: {
          type: 'text',
          value: [],
          required: false,
          disabled: false
        }
      }

      const result = parseArray(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id

      expect(result).toEqual(expected)

      delete schema.attrs

      expected.isArrayField = true,
      expected.attrs.type = 'select'
      expected.attrs.multiple = true

      const result2 = parseArray(schema)

      expect(typeof result2.attrs.id).toEqual('string')
      delete result2.attrs.id

      expect(result2).toEqual(expected)
    })

    it('should successfully parse with defined schema.oneOf', () => {
      const schema = {
        type: 'array',
        oneOf: [{ value: 'v', label: 'l' }]
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        minItems: 1,
        maxItems: 1000,
        items: [{ value: 'v', label: 'l', name: 'l' }],
        attrs: {
          type: 'radio',
          value: '',
          required: false,
          disabled: false
        }
      }

      const result = parseArray(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id
      delete result.items[0].id

      expect(result).toEqual(expected)
    })

    it('should successfully parse with defined schema.anyOf', () => {
      const schema = {
        type: 'array',
        anyOf: [{ value: 'v', label: 'l' }]
      }
      const expected = {
        schemaType: 'array',
        label: '',
        description: '',
        isArrayField: true,
        minItems: 1,
        maxItems: 1000,
        items: [{ value: 'v', label: 'l', name: 'l' }],
        attrs: {
          type: 'checkbox',
          value: [undefined],
          required: false,
          disabled: false
        }
      }

      const result = parseArray(schema)

      expect(typeof result.attrs.id).toEqual('string')
      delete result.attrs.id
      delete result.items[0].id

      expect(result).toEqual(expected)
    })
  })

  describe('loadFields(schema, fields, name = null)', () => {
    describe('schema.type === boolean', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = { type: 'boolean' }
        const expected = [{
          schemaType: 'boolean',
          label: '',
          description: '',
          attrs: {
            type: 'checkbox',
            checked: false,
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === array', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = { type: 'array' }
        const expected = [{
          schemaType: 'array',
          label: '',
          description: '',
          isArrayField: true,
          items: [],
          minItems: 1,
          maxItems: 1000,
          attrs: {
            type: 'text',
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === integer', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = { type: 'integer' }
        const expected = [{
          schemaType: 'integer',
          label: '',
          description: '',
          attrs: {
            type: 'number',
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === string', () => {
      it('should successfully load the schema', () => {
        const fields = []
        const schema = {
          type: 'string',
          enum: [{ value: 'v', label: 'l' }]
        }
        const expected = [{
          schemaType: 'string',
          label: '',
          description: '',
          minItems: 1,
          maxItems: 1000,
          items: [{ value: 'v', label: 'l' }],
          attrs: {
            type: 'select',
            value: '',
            required: false,
            disabled: false,
            multiple: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })

      it('should successfully load the schema with stringify enum values', () => {
        const fields = []
        const schema = {
          type: 'string',
          enum: ['v']
        }
        const expected = [{
          schemaType: 'string',
          label: '',
          description: '',
          minItems: 1,
          maxItems: 1000,
          items: [{ value: 'v', label: 'v' }],
          attrs: {
            type: 'select',
            value: '',
            required: false,
            disabled: false,
            multiple: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })
    })

    describe('schema.type === object', () => {
      it('should successfully load a scalar field', () => {
        const fields = []
        const schema = {
          type: 'object',
          properties: {
            bool: { type: 'boolean' }
          }
        }
        const expected = [{
          schemaType: 'boolean',
          label: '',
          description: '',
          attrs: {
            type: 'checkbox',
            name: 'bool',
            checked: false,
            required: false,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })

      it('should successfully load array string field', () => {
        const fields = []
        const schema = {
          type: 'object',
          properties: {
            string: {
              type: 'string',
              enum: ['v']
            }
          }
        }
        const expected = [{
          schemaType: 'string',
          label: '',
          description: '',
          minItems: 1,
          maxItems: 1000,
          items: [{ value: 'v', label: 'v' }],
          attrs: {
            type: 'select',
            name: 'string',
            value: '',
            required: false,
            disabled: false,
            multiple: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })

      it('should successfully load the schema with required fields', () => {
        const fields = []
        const schema = {
          type: 'object',
          properties: {
            bool: { type: 'boolean' }
          },
          required: ['bool']
        }
        const expected = [{
          schemaType: 'boolean',
          label: '',
          description: '',
          attrs: {
            type: 'checkbox',
            name: 'bool',
            checked: false,
            required: true,
            disabled: false
          }
        }]

        loadFields(schema, fields)

        expect(typeof fields[0].attrs.id).toEqual('string')
        delete fields[0].attrs.id

        expect(fields).toEqual(expected)
      })

      it('should successfully load the schema with ordered fields', () => {
        const fields = []
        const schema = {
          type: 'object',
          properties: {
            three: { type: 'boolean' },
            two: { type: 'boolean' },
            one: { type: 'boolean' },
            four: { type: 'boolean' }
          },
          order: ['one', 'two']
        }
        const expected = [
          {
            schemaType: 'boolean',
            label: '',
            description: '',
            attrs: {
              type: 'checkbox',
              name: 'one',
              checked: false,
              required: false,
              disabled: false
            }
          },
          {
            schemaType: 'boolean',
            label: '',
            description: '',
            attrs: {
              type: 'checkbox',
              name: 'two',
              checked: false,
              required: false,
              disabled: false
            }
          },
          {
            schemaType: 'boolean',
            label: '',
            description: '',
            attrs: {
              type: 'checkbox',
              name: 'three',
              checked: false,
              required: false,
              disabled: false
            }
          },
          {
            schemaType: 'boolean',
            label: '',
            description: '',
            attrs: {
              type: 'checkbox',
              name: 'four',
              checked: false,
              required: false,
              disabled: false
            }
          }
        ]

        loadFields(schema, fields)

        fields.forEach((field) => {
          expect(typeof field.attrs.id).toEqual('string')
          delete field.attrs.id
        })

        expect(fields).toEqual(expected)
      })
    })
  })

  describe('parseDefaultScalarValue(schema, fields, value)', () => {
    it('should parse default value with an empty schema', () => {
      const schema = {}
      const fields = []

      loadFields(schema, fields)

      const result = parseDefaultScalarValue(schema, fields)

      expect(result).toEqual(undefined)
    })

    describe('should parse default value with scalar type', () => {
      const proto = [
        {
          type: 'boolean',
          values: [ false, true ]
        },
        {
          type: 'integer',
          values: [ undefined, 0, 1, -1 ]
        },
        {
          type: 'number',
          values: [ undefined, 0.0, 1.0, -1.0, 2.1, -2.1 ]
        },
        {
          type: 'string',
          values: [ undefined, '', ' ', 'hello world' ]
        }
      ]

      proto.forEach(({ type, values }) => {
        describe(`with ${type}`, () => {
          values.forEach((value, i) => {
            it(`should parse ${JSON.stringify(value)} with default value === ${JSON.stringify(value)}`, () => {
              const schema = {
                type: type,
                default: value
              }

              if (value === undefined) {
                delete schema.default
              }

              const fields = []

              loadFields(schema, fields)

              const result = parseDefaultScalarValue(schema, fields)

              expect(result).toEqual(value)
            })

            it(`should parse ${JSON.stringify(value)} with initial value === ${JSON.stringify(value)}`, () => {
              const schema = {
                type: type
              }

              const fields = []

              loadFields(schema, fields)

              const result = parseDefaultScalarValue(schema, fields, value)

              expect(result).toEqual(value)
            })

            if (i % 2) {
              const initial = values[i - 1]

              it(`should parse ${JSON.stringify(value)} with default === ${JSON.stringify(initial)} and initial === ${JSON.stringify(value)}`, () => {
                const schema = {
                  type: type,
                  default: initial
                }

                const fields = []

                loadFields(schema, fields)

                const result = parseDefaultScalarValue(schema, fields, value)

                expect(result).toEqual(value)
              })

              it(`should parse ${JSON.stringify(value)} with default === ${JSON.stringify(initial)} and attrs.value === ${JSON.stringify(value)}`, () => {
                const schema = {
                  type: type,
                  default: initial,
                  attrs: { value }
                }

                if (type === 'boolean') {
                  schema.attrs.checked = value === true

                  delete schema.attrs.value
                }

                const fields = []

                loadFields(schema, fields)

                const result = parseDefaultScalarValue(schema, fields)

                expect(result).toEqual(value)
              })

              it(`should parse ${JSON.stringify(value)} with initial === ${JSON.stringify(initial)} and attrs.value === ${JSON.stringify(value)}`, () => {
                const schema = {
                  type: type,
                  attrs: { value }
                }

                const propsData = { schema, value }

                if (type === 'boolean') {
                  propsData.value = value === true
                  schema.attrs.checked = propsData.value

                  delete schema.attrs.value
                }

                const fields = []

                loadFields(schema, fields)

                const result = parseDefaultScalarValue(schema, fields, value)

                expect(result).toEqual(value)
              })
            }
          })
        })
      })
    })
  })

  describe('parseEventValue({ target, field, data })', () => {
    const proto = [
      {
        type: 'boolean',
        values: [ false, true ]
      },
      {
        type: 'string',
        values: [ undefined, '', ' ', 'hello world' ]
      },
      {
        type: 'integer',
        values: [ undefined, 0, 1, -1, '9', '-0', '-5' ]
      },
      {
        type: 'number',
        values: [ undefined, 0.0, 1.0, -1.0, 2.1, -2.1, '-3.2', '12.5' ]
      },
      {
        type: 'array',
        values: [ undefined, [], [1] ]
      },
      {
        type: 'object',
        values: [ undefined, {}, { x: 1 } ]
      }
    ]

    proto.forEach(({ type, values }) => {
      describe(`should successfully parse with ${type}`, () => {
        values.forEach((data) => {
          it(`should parse ${JSON.stringify(data)} with input value === ${JSON.stringify(data)}`, () => {
            const field = { schemaType: type }
            const checked = data === true
            const target = { checked }

            const expected = data === undefined && type === 'string'
              ? ''
              : ['integer', 'number'].includes(type) && data !== undefined
                ? parseFloat(data)
                : type === 'array' && data === undefined
                  ? []
                  : type === 'object' && data === undefined
                    ? {}
                    : data

            const result = parseEventValue({ target, field, data })

            expect(result).toEqual(expected)
          })
        })
      })
    })
  })

  describe('parseDefaultObjectValue(schema, fields, value)', () => {
    [
      {
        type: 'boolean',
        values: [ false, true ]
      },
      {
        type: 'string',
        values: [ undefined, '', ' ', 'hello world' ]
      },
      {
        type: 'integer',
        values: [ undefined, 0, 1, -1, '9', '-0', '-5' ]
      },
      {
        type: 'number',
        values: [ undefined, 0.0, 1.0, -1.0, 2.1, -2.1, '-3.2', '12.5' ]
      }
    ].forEach(({ type, values }) => {
      describe(`should successfully parse with object schema and ${type} property`, () => {
        values.forEach((value) => {
          it(`should parse { x: ${JSON.stringify(value)} } with input value === ${JSON.stringify(value)}`, () => {
            const schema = {
              type: 'object',
              properties: {
                x: { type }
              }
            }

            const fields = []
            const expected = value === undefined && type === 'string'
              ? ''
              : ['integer', 'number'].includes(type) && value !== undefined
                ? parseFloat(value)
                : value

            loadFields(schema, fields)

            const result = parseDefaultObjectValue(schema, fields, { x: value })

            expect(result).toEqual({ x: expected })
          })
        })
      })
    })

    describe(`should successfully parse with array schema`, () => {
      [
        [],
        ['x'],
        ['x', 'z'],
        ['x', 'y', 'z'],
        ['z', 'x', 'y']
      ].forEach((value) => {
        it(`should parse ${JSON.stringify(value)} with input value === ${JSON.stringify(value)}`, () => {
          const schema = {
            type: 'array',
            enum: [
              { value: 'x', label: 'l' },
              { value: 'y', label: 'm' },
              { value: 'z', label: 'n' }
            ]
          }

          const fields = []

          loadFields(schema, fields)

          const expected = [...value]
          const result = parseDefaultObjectValue(schema, fields, value)

          expect([...result]).toEqual(expected)
        })

        it(`should parse { x: ${JSON.stringify(value)} } with input value === ${JSON.stringify(value)}`, () => {
          const schema = {
            type: 'object',
            properties: {
              x: {
                type: 'array',
                enum: [
                  { value: 'x', label: 'l' },
                  { value: 'y', label: 'm' },
                  { value: 'z', label: 'n' }
                ]
              }
            }
          }

          const fields = []

          loadFields(schema, fields)

          const expected = { x: value }
          const result = parseDefaultObjectValue(schema, fields, { x: value })

          expect(result).toEqual(expected)
        })
      })
    })
  })
})
