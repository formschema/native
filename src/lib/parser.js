import { isScalar, assign } from './object'

/* eslint-disable no-labels */

const ARRAY_KEYWORDS = [ 'anyOf', 'oneOf', 'enum' ]

export const SCHEMA_TYPES = Object.freeze({
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  INTEGER: 'integer',
  NUMBER: 'number',
  OBJECT: 'object',
  STRING: 'string'
})

export const INPUT_TYPES = Object.freeze({
  CHECKBOX: 'checkbox',
  EMAIL: 'email',
  HIDDEN: 'hidden',
  NUMBER: 'number',
  RADIO: 'radio',
  SELECT: 'select',
  SWITCH: 'switch',
  TEXT: 'text',
  TEXTAREA: 'textarea',
  URL: 'url',
  OBJECT: 'object'
})

export const NUMBER_TYPES = Object.freeze([
  SCHEMA_TYPES.INTEGER,
  SCHEMA_TYPES.NUMBER
])

export function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export function genId (prefix = '') {
  const suffix = s4() + s4()

  if (prefix) {
    return `${prefix}-${suffix}`
  }

  return suffix
}

/* eslint-disable-next-line max-len */
export function setCommonFields (schema, field, name, path, model = null, required = []) {
  if (model !== null) {
    field.attrs.value = model
  } else if (field.attrs.hasOwnProperty('value')) {
    field.attrs.value = field.attrs.value
  } else {
    field.attrs.value = schema.default
  }

  const id = field.attrs.id || genId(field.attrs.name)
  const labelId = schema.title ? `${id}-label` : undefined
  const descId = schema.description ? `${id}-desc` : undefined
  const ariaLabels = [ labelId, descId ].filter((item) => item)

  if (name) {
    field.attrs.name = name
    field.path = path ? [ ...path, name ] : [ name ]

    if (required.includes(name)) {
      field.attrs.required = true
    }
  }

  field.order = schema.order
  field.schemaType = schema.type
  field.label = schema.title || ''
  field.description = schema.description || ''

  field.attrs.id = id
  field.attrs.disabled = schema.disabled || false
  field.attrs.required = field.attrs.required
    || (schema.required === true)
    || false

  field.labelAttrs = {
    id: labelId,
    for: id
  }

  field.descAttrs = {
    id: descId
  }

  if (field.attrs.required) {
    /**
     * Add support with web browsers that don’t communicate the required
     * attribute to assistive technology
     * @see https://www.w3.org/WAI/tutorials/forms/validation/#validating-required-input
     */
    field.attrs['aria-required'] = 'true'
  }

  if (ariaLabels.length && !field.attrs.hasOwnProperty('aria-labelledby')) {
    /**
     * Use the WAI-ARIA aria-labelledby attribute to associate instructions
     * with form controls
     * @see https://www.w3.org/WAI/tutorials/forms/instructions/#using-aria-labelledby
     */
    field.attrs['aria-labelledby'] = ariaLabels.join(' ')

    if (ariaLabels.length >= 2) {
      /**
       * Add `tabindex="-1"` to elements that are referenced by aria-labelledby
       * if it point to two or more elements for Internet Explorer
       * compatibility
       */
      field.labelAttrs.tabindex = '-1'
      field.descAttrs.tabindex = '-1'
    }
  }
}

export function parseDefaultScalarValue (schema, fields, value) {
  if (typeof value !== 'undefined' && isScalar(value)) {
    return value
  }

  if (fields.length) {
    if (fields[0].schemaType === SCHEMA_TYPES.BOOLEAN) {
      return fields[0].attrs.checked === true
    }

    if (fields[0].attrs.hasOwnProperty('value')) {
      return fields[0].attrs.value
    }
  }

  return undefined
}

export function parseEventValue ({ field, data }) {
  switch (field.schemaType) {
    case SCHEMA_TYPES.BOOLEAN:
      return data || false

    case SCHEMA_TYPES.STRING:
      return data || ''

    case SCHEMA_TYPES.NUMBER:
    case SCHEMA_TYPES.INTEGER:
      if (data !== undefined) {
        return Number(data)
      }

      break

    case SCHEMA_TYPES.ARRAY:
      return data || []

    case SCHEMA_TYPES.OBJECT:
      return data || {}
  }

  return data
}

export function parseDefaultObjectValue (schema, fields, value) {
  const data = schema.type === SCHEMA_TYPES.OBJECT ? {} : []

  if (value) {
    assign(data, value)
  }

  fields.forEach((field) => {
    const { type, name } = field.attrs
    const itemValue = field.schemaType === SCHEMA_TYPES.BOOLEAN
      ? typeof data[name] === 'boolean'
        ? data[name]
        : field.attrs.checked === true
      : typeof data[name] !== 'undefined'
        ? data[name]
        : field.attrs.value

    const target = {}
    const eventInput = { field, data: itemValue }

    switch (field.schemaType) {
      case SCHEMA_TYPES.BOOLEAN:
        target.checked = itemValue
        data[name] = parseEventValue(eventInput)
        break

      case SCHEMA_TYPES.OBJECT: {
        const nestedSchema = schema.properties[name]
        const nestedValue = typeof value !== 'undefined' && value !== null
          ? value[name]
          : value

        data[name] = parseDefaultObjectValue(
          nestedSchema, field.fields, nestedValue
        )
        break
      }

      default:
        if (field.isArrayField) {
          if (data[name] instanceof Array) {
            data[name] = data[name].filter((value) => value !== undefined)
          } else {
            // Initialize array value to field.minItems size
            data[name] = []
          }

          const startIndex = Math.max(data[name].length, 0)
          const endIndex = Math.max(data[name].length, field.minItems)

          for (let i = startIndex; i < endIndex; i++) {
            /**
             * If field.items is present (this is fed by schema enum),
             * use these values to populate the array
             */
            if (field.items && field.items.length > i) {
              data[name].push(field.items[i].value)
            } else {
              data[name][i] = ''
            }
          }

          field.itemsNum = type === INPUT_TYPES.CHECKBOX
            ? field.items.length
            : value
              ? data[name].length
              : field.minItems
        } else {
          data[name] = parseEventValue(eventInput)
        }

        break
    }
  })

  return data
}

/* eslint-disable-next-line max-len */
export function loadFields (schema, fields, name = null, model = null, path = null, required = []) {
  switch (schema.type) {
    case SCHEMA_TYPES.OBJECT:
      fields.push(...parseObject(schema, name, model, path))
      break

    case SCHEMA_TYPES.BOOLEAN:
      fields.push(parseBoolean(schema, name, model, path, required))
      break

    case SCHEMA_TYPES.ARRAY:
      fields.push(parseArray(schema, name, model, path, required))
      break

    case SCHEMA_TYPES.INTEGER:
    case SCHEMA_TYPES.NUMBER:
    case SCHEMA_TYPES.STRING:
      for (const keyword of ARRAY_KEYWORDS) {
        if (schema.hasOwnProperty(keyword)) {
          schema.items = {
            type: schema.type,
            enum: schema[keyword]
          }
          fields.push(parseArray(schema, name, model, path, required))
          return
        }
      }

      fields.push(parseString(schema, name, model, path, required))
      break
  }
}

/* eslint-disable-next-line max-len */
export function parseObject (schema, name = null, model = null, path = null, required = []) {
  if (!schema.hasOwnProperty('properties')) {
    schema.properties = {}
  }

  const allProperties = Object.keys(schema.properties)
  const properties = schema.order instanceof Array
    ? schema.order
    : allProperties

  if (properties.length < allProperties.length) {
    allProperties.forEach((prop) => {
      if (!properties.includes(prop)) {
        properties.push(prop)
      }
    })
  }

  if (model === null) {
    model = {}
  }

  const field = {
    attrs: schema.attrs || {}
  }

  if (schema.required instanceof Array) {
    required.push(...schema.required)
  }

  field.attrs.type = INPUT_TYPES.OBJECT
  setCommonFields(schema, field, name, path, model, required)
  field.fields = []

  properties.forEach((key) => {
    loadFields(
      schema.properties[key],
      field.fields,
      key,
      model[key] || null,
      field.path,
      required
    )
  })

  return name ? [ field ] : field.fields
}

/* eslint-disable-next-line max-len */
export function parseBoolean (schema, name = null, model = null, path, required = []) {
  const field = {
    attrs: schema.attrs || {}
  }

  setCommonFields(schema, field, name, path, model, required)

  if (!field.attrs.type) {
    field.attrs.type = INPUT_TYPES.CHECKBOX
  }

  if (!field.attrs.hasOwnProperty('checked')) {
    field.attrs.checked = schema.default === true
  }

  delete field.attrs.value

  return field
}

/* eslint-disable-next-line max-len */
export function parseString (schema, name = null, model = null, path = null, required = []) {
  const field = {
    attrs: schema.attrs || {}
  }

  if (schema.pattern) {
    field.attrs.pattern = schema.pattern
  }

  if (schema.format) {
    switch (schema.format) {
      case 'email':
        if (!field.attrs.type) {
          field.attrs.type = INPUT_TYPES.EMAIL
        }

        break

      case 'uri':
        if (!field.attrs.type) {
          field.attrs.type = INPUT_TYPES.URL
        }

        break
    }
  }

  if (!field.attrs.type) {
    field.attrs.type = NUMBER_TYPES.includes(schema.type)
      ? INPUT_TYPES.NUMBER
      : INPUT_TYPES.TEXT
  }

  setCommonFields(schema, field, name, path, model, required)

  if (schema.minLength) {
    field.attrs.minlength = schema.minLength
  }

  if (schema.maxLength) {
    field.attrs.maxlength = schema.maxLength
  }

  return field
}

export function parseItems (items) {
  return items.map((item) => {
    if (typeof item !== 'object') {
      return { value: item, label: item }
    }

    return item
  })
}

export const setItemName = (name, isRadio = false) => (item, i) => {
  if (isRadio) {
    item.name = name
  }

  if (!item.name) {
    item.name = name ? `${name}-` : ''
    item.name += item.label.replace(/\s+/g, '-')
  }

  if (name) {
    item.ref = `${name}-${i}`
  }

  if (!item.id) {
    item.id = genId(item.name || name)
  }

  return item
}

export function arrayOrderedValues (field) {
  return field.items.map((item) => (item.checked ? item.value : undefined))
}

export function arrayUnorderedValues (field) {
  return field.items
    .filter((item) => (item.checked || item.selected))
    .map((item) => item.value)
}

export function singleValue (field) {
  /* eslint-disable arrow-body-style */
  const item = field.items.reverse().find((item) => {
    return item.checked || item.selected
  })

  return item ? item.value : ''
}

const NOT_ARRAY = [
  INPUT_TYPES.RADIO,
  INPUT_TYPES.CHECKBOX,
  INPUT_TYPES.SWITCH
]

function isValueEmpty (value) {
  return value === undefined || value.length === 0
}

/* eslint-disable-next-line max-len */
export function parseArray (schema, name = null, model = null, path = null, required = []) {
  const field = {
    attrs: schema.attrs || {}
  }

  setCommonFields(schema, field, name, path, model, required)

  field.items = []
  field.minItems = parseInt(schema.minItems, 10) || 0
  field.maxItems = parseInt(schema.maxItems, 10) || 1000

  loop:
  for (const keyword of ARRAY_KEYWORDS) {
    if (schema.hasOwnProperty(keyword)) {
      switch (keyword) {
        case 'enum':
          if (!field.attrs.type) {
            field.attrs.type = INPUT_TYPES.SELECT
          }

          field.items = parseItems(schema[keyword]).map(setItemName(name, true))

          if (isValueEmpty(field.attrs.value)) {
            field.attrs.value = field.schemaType === 'array'
              ? arrayUnorderedValues(field)
              : singleValue(field)
          }

          break loop

        case 'oneOf':
          field.attrs.type = INPUT_TYPES.RADIO
          field.attrs.value = field.attrs.value || ''

          field.items = parseItems(schema[keyword])
            .map(setItemName(name, true))

          if (isValueEmpty(field.attrs.value)) {
            field.attrs.value = singleValue(field)
          }

          break loop

        case 'anyOf':
          field.attrs.type = INPUT_TYPES.CHECKBOX
          field.attrs.value = field.attrs.value || []

          field.items = parseItems(schema[keyword]).map(setItemName(name))
          field.isArrayField = true

          if (isValueEmpty(field.attrs.value)) {
            field.attrs.value = arrayOrderedValues(field)
          }

          break loop
      }
    }
  }

  if (!field.attrs.type) {
    field.isArrayField = true
    field.attrs.type = schema.items && NUMBER_TYPES.includes(schema.items.type)
      ? schema.items.type
      : INPUT_TYPES.TEXT
  } else if (field.attrs.type === INPUT_TYPES.SELECT) {
    field.attrs.multiple = field.schemaType === SCHEMA_TYPES.ARRAY
    field.attrs.value = field.attrs.value || (field.attrs.multiple ? [] : '')

    if (isValueEmpty(field.attrs.value)) {
      if (field.attrs.multiple) {
        field.isArrayField = true
        field.attrs.value = arrayUnorderedValues(field)
      } else {
        field.attrs.value = singleValue(field)
      }
    }
  } else if (!NOT_ARRAY.includes(field.attrs.type)) {
    field.isArrayField = true
  }

  return field
}
