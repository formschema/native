'use strict'

import Vue from 'vue'
import { sequence } from './object'

const seq = sequence()

const setFieldId = (field) => {
  field.id = `field-${field.name}-${seq.next().value}`
}

const setCommonFields = (schema, field) => {
  field.value = schema.default || ''
  field.label = schema.title || ''
  field.description = schema.description || ''
  field.required = schema.required || false
  field.disabled = schema.disabled || false

  if (field.required) {
    if (field.label) {
      field.label += ' *'
    }
  }
}

const setFormValue = (form, field) => {
  if (form.value && !form.value[field.name]) {
    Vue.set(form.value, field.name, field.value || '')
  }
}

export const loadFields = (form, schema) => {
  if (!schema || schema.visible === false) {
    return
  }

  switch (schema.type) {
    case 'object':
      for (let key in schema.properties) {
        schema.properties[key].name = key

        if (schema.required) {
          for (let field of schema.required) {
            if (schema.properties[field]) {
              schema.properties[field].required = true
            }
          }
        }

        loadFields(form, schema.properties[key])
      }
      break

    case 'boolean':
      form.fields.push(parseBoolean(form, schema))
      break

    case 'array':
      form.fields.push(parseArray(form, schema))
      break

    case 'integer':
    case 'number':
    case 'string':
      if (schema.enum) {
        schema.items = {
          type: schema.type,
          enum: schema.enum
        }
        form.fields.push(parseArray(form, schema))
        break
      }
      form.fields.push(parseString(form, schema))
      break
  }
}

export const parseBoolean = (form, schema) => {
  let field = schema.attrs || {}

  setCommonFields(schema, field)

  field.type = 'checkbox'
  field.checked = schema.checked || false
  
  if (schema.name) {
    field.name = schema.name

    setFormValue(form, field)
  }

  if (!field.id) {
    setFieldId(field)
  }

  return field
}

export const parseString = (form, schema) => {
  let field = schema.attrs || {}

  if (!field.type) {
    switch (schema.type) {
      case 'number':
      case 'integer':
        field.type = 'number'
        break
      default:
        field.type = 'text'
    }
  }

  if (schema.format) {
    switch (schema.format) {
      case 'email':
        field.type = 'email'
        break
      case 'uri':
        field.type = 'url'
        break
      case 'regex':
        field.type = 'text'
        field.pattern = schema.format
        break
    }
  }

  setCommonFields(schema, field)

  if (schema.name) {
    field.name = schema.name

    setFormValue(form, field)
  }

  if (schema.minLength) {
    field.minlength = schema.minLength
  }

  if (schema.maxLength) {
    field.maxlength = schema.maxLength
  }

  if (!field.id) {
    setFieldId(field)
  }

  return field
}

export const parseArray = (form, schema) => {
  let field = schema.attrs || {}

  setCommonFields(schema, field)

  field.multiple = schema.minItems > 1

  if (!field.type) {
    field.type = 'select'
  }

  field.options = []

  if (schema.items && schema.items.enum) {
    schema.items.enum.forEach((item) => {
      if (item === null) {
        return
      }

      if (typeof item !== 'object') {
        item = { value: item, label: item }
      }

      field.options.push(item)
    })
  }

  if (schema.name) {
    field.name = schema.name

    setFormValue(form, field)
  }

  if (!field.id) {
    setFieldId(field)
  }

  return field
}
