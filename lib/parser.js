'use strict'

const ARRAY_KEYWORDS = ['anyOf', 'oneOf', 'enum']

const setCommonFields = (schema, field) => {
  field.attrs.value = schema.hasOwnProperty('default')
    ? schema.default
    : field.attrs.hasOwnProperty('value') ? field.attrs.value : ''

  field.schemaType = schema.type
  field.label = schema.title || ''
  field.description = schema.description || ''
  field.attrs.required = schema.required || false
  field.attrs.disabled = schema.disabled || false
}

export const loadFields = (vm, schema, name = null) => {
  if (!schema || schema.visible === false) {
    return
  }

  switch (schema.type) {
    case 'object':
      for (let key in schema.properties) {
        if (schema.required) {
          for (let field of schema.required) {
            if (schema.properties[field]) {
              schema.properties[field].required = true
            }
          }
        }

        loadFields(vm, schema.properties[key], key)
      }
      break

    case 'boolean':
      vm.fields.push(parseBoolean(vm, schema, name))
      break

    case 'array':
      vm.fields.push(parseArray(vm, schema, name))
      break

    case 'integer':
    case 'number':
    case 'string':
      for (let keyword of ARRAY_KEYWORDS) {
        if (schema.hasOwnProperty(keyword)) {
          schema.items = {
            type: schema.type,
            enum: schema[keyword]
          }
          vm.fields.push(parseArray(vm, schema, name))
          return
        }
      }
      vm.fields.push(parseString(vm, schema, name))
      break
  }
}

export const parseBoolean = (vm, schema, name = null) => {
  const field = {
    attrs: schema.attrs || {}
  }

  setCommonFields(schema, field)

  if (!field.attrs.type) {
    field.attrs.type = 'checkbox'
  }

  field.attrs.checked = schema.checked || false

  if (schema.name) {
    field.attrs.name = name
  }

  return field
}

export const parseString = (vm, schema, name = null) => {
  const field = {
    attrs: schema.attrs || {}
  }

  if (!field.attrs.type) {
    switch (schema.type) {
      case 'number':
      case 'integer':
        field.attrs.type = 'number'
        break
      default:
        field.attrs.type = 'text'
    }
  }

  if (schema.pattern) {
    field.pattern = schema.pattern
  }

  if (schema.format) {
    switch (schema.format) {
      case 'email':
        if (!field.attrs.type) {
          field.attrs.type = 'email'
        }
        break

      case 'uri':
        if (!field.attrs.type) {
          field.attrs.type = 'url'
        }
        break
    }
  }

  setCommonFields(schema, field)

  if (name) {
    field.attrs.name = name
  }

  if (schema.minLength) {
    field.attrs.minlength = schema.minLength
  }

  if (schema.maxLength) {
    field.attrs.maxlength = schema.maxLength
  }

  return field
}

export const parseItems = (items) => {
  return items.map((item) => {
    if (typeof item !== 'object') {
      return { value: item, label: item }
    }

    return item
  })
}

export const parseArray = (vm, schema, name = null) => {
  const field = {
    attrs: schema.attrs || {}
  }

  setCommonFields(schema, field)

  field.attrs.multiple = schema.minItems > 1
  field.items = []

  loop:
    for (let keyword of ARRAY_KEYWORDS) {
      if (schema.hasOwnProperty(keyword)) {
        switch (keyword) {
          case 'enum':
            if (!field.attrs.type) {
              field.attrs.type = 'select'
            }
            field.attrs.value = field.attrs.value || ''
            field.items = parseItems(schema[keyword])
            break loop

          case 'oneOf':
            field.attrs.type = 'radio'
            field.attrs.value = field.attrs.value || ''
            field.items = parseItems(schema[keyword])
            break loop

          case 'anyOf':
            field.attrs.type = 'checkbox'
            field.attrs.value = field.attrs.value || []
            field.items = parseItems(schema[keyword])
            break loop
        }
      }
    }

  if (!field.attrs.type) {
    field.attrs.type = 'text'
  }

  field.minItems = parseInt(schema.minItems) || 1
  field.maxItems = parseInt(schema.maxItems) || 1000

  if (name) {
    field.attrs.name = name
  }

  return field
}
