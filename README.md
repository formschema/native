# FormSchema Native

Vue component form based on JSON Schema

[![npm](https://img.shields.io/npm/v/@formschema/native.svg)](https://www.npmjs.com/package/@formschema/native) [![Build status](https://gitlab.com/formschema/native/badges/master/build.svg)](https://gitlab.com/formschema/native/pipelines)

**`vue-json-schema` has been moved to the [FormSchema organization](https://gitlab.com/formschema) with the new name `FormSchemaNative`**

## Install
```sh
npm install --save @formschema/native
```

## Demo

- [Demo with ElementUI](https://gitlab.com/formschema/elementui)

[![formschema-demo-elementui](https://gitlab.com/formschema/elementui/raw/master/screenshot.png "FormSchema Demo with ElementUI")](https://gitlab.com/formschema/elementui)

## FormSchema API

### props 

- `schema` ***Object*** (*required*) 
The JSON Schema object. Use the `v-if` directive to load asynchronous schema. 

- `v-model` ***Object*** (*optional*) `default: [object Object]` 
Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type. 

- `autocomplete` ***String*** (*optional*) 
This property indicates whether the value of the control can be automatically completed by the browser. Possible values are: `off` and `on`. 

- `novalidate` ***Boolean*** (*optional*) 
This Boolean attribute indicates that the form is not to be validated when submitted. 

- `input-wrapping-class` ***String*** (*optional*) 
Define the inputs wrapping class. Leave `undefined` to disable input wrapping. 

### events 

- `input` Fired synchronously when the value of an element is changed. 

- `change` Fired when a change to the element's value is committed by the user. 

- `invalid` Fired when a submittable element has been checked and doesn't satisfy its constraints. The validity of submittable elements is checked before submitting their owner form, or after the `checkValidity()` of the element or its owner form is called. 

- `submit` Fired when a form is submitted 

### methods 

- `input(name)` 
Get a form input reference 

- `form()` 
Get the form reference 

- `checkValidity()` 
Checks whether the form has any constraints and whether it satisfies them. If the form fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns false. 

- `reset()` 
Reset the value of all elements of the parent form. 

- `submit(event)` 
Send the content of the form to the server 

- `setErrorMessage(message)` 
Set a message error. 

- `clearErrorMessage()` 
clear the message error. 

## Usage

Define your [JSON Schema](http://json-schema.org) file:

```json
{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "title": "Newsletter Subscription",
    "properties": {
        "name": {
            "type": "string", 
            "minLength": 8, 
            "maxLength": 80, 
            "attrs": {
              "placeholder": "Full Name",
              "title": "Please enter your full name"
            }
        },
        "email": {
            "type": "string", 
            "maxLength": 120, 
            "attrs": {
                "type": "email",
                "placeholder": "Email"
            }
        },
        "lists": {
            "type": "string",
            "enum": ["Daily New", "Promotion"]
        }
    },
    "additionalProperties": false,
    "required": ["name", "email", "lists"]
}
```

In your Vue file:

```html
<template>
  <FormSchemaNative :schema="schema" v-model="model" @submit="submit">
    <button type="submit">Subscribe</button>
  </FormSchemaNative>
</template>

<script>
  import FormSchemaNative from '@formschema/native'
  import schema from './schema/newsletter-subscription.json'

  export default {
    data: () => ({
      schema: schema,
      model: {}
    }),
    methods: {
      submit (e) {
        // this.model contains the valid data according your JSON Schema.
        // You can submit your model to the server here
      }
    },
    components: { FormSchemaNative }
  }
</script>
```

## Use custom form elements

Use `FormSchemaNative.setComponent(type, component[, props = {}])` to define custom element to use for rendering.

See [FormSchema ElementUI Demo](https://gitlab.com/formschema/elementui) for a complete example.

```js
// an element-ui example

import FormSchemaNative from '@formschema/native'
import {
  Form,
  FormItem,
  Input,
  Radio,
  Checkbox,
  Select,
  Option,
  Button
} from 'element-ui'

FormSchemaNative.setComponent('label', FormItem)
FormSchemaNative.setComponent('email', Input)
FormSchemaNative.setComponent('text', Input)
FormSchemaNative.setComponent('textarea', Input)
FormSchemaNative.setComponent('checkbox', Checkbox)
FormSchemaNative.setComponent('radio', Radio)
FormSchemaNative.setComponent('select', Select)
FormSchemaNative.setComponent('option', Option)

// Use the third argument to define props of the component
FormSchemaNative.setComponent('button', Button, {
  type: 'primary',
  label: 'Subscribe'
})

// The third argument can also be a function that return an object
FormSchemaNative.setComponent('form', Form, ({ vm }) => {
  // vm is the FormSchema VM

  const labelWidth = '120px'
  const model = vm.data
  const rules = {}

  vm.fields.forEach((field) => {
    rules[field.name] = {
      required: field.required,
      message: field.title
    }
  })

  // returning the form props
  return { labelWidth, rules, model }
})

// By default `<h1/>` is used to render the form title.
// To override this, use the `title` type:
FormSchemaNative.setComponent('title', 'h2')

// By default `<p/>` is used to render the form description.
// To override this, use the `description` type:
FormSchemaNative.setComponent('description', 'small')

// By default `<div/>` is used to render the message error.
// To override this, use the `error` type:
FormSchemaNative.setComponent('error', 'el-alert', ({ vm }) => ({
  type: 'error',
  title: vm.error
}))

export default {
  data: () => ({
    schema: {...}
  }),
  // ...
  components: { FormSchemaNative }
}
```

## Multiple Checkbox elements

To define multiple checkbox, use the [JSON Schema keyword `anyOf`](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.27):

**schema.json**

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "multipleCheckbox": {
      "type": "array",
      "anyOf": [
        { "value": "daily", "label": "Daily New" },
        { "value": "promotion", "label": "Promotion" }
      ]
    }
  }
}

```

**component.vue**

```html
<script>
  import FormSchemaNative from '@formschema/native'

  FormSchemaNative.setComponent('select', 'el-select', ({ item }) => {
    return { label: item.value }
  })

  FormSchemaNative.setComponent('checkboxgroup', 'el-checkbox-group')

  export default { ... }
</script>
```

## Grouped Radio elements

To group radio elements, use the [JSON Schema keyword `enum`](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.23) and `attrs.type === 'radio'`:

**schema.json**

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "groupedRadio": {
      "type": "string",
      "enum": [
        { "value": "daily", "label": "Daily New" },
        { "value": "promotion", "label": "Promotion" }
      ],
      "attrs": {
        "type": "radio"
      }
    }
  }
}

```

**component.vue**

```html
<script>
  import FormSchemaNative from '@formschema/native'

  FormSchemaNative.setComponent('select', 'el-radio', ({ item }) => {
    return { label: item.value }
  })

  FormSchemaNative.setComponent('radiogroup', 'el-radio-group')

  export default { ... }
</script>
```

## License

Under the MIT license. See [LICENSE](https://gitlab.com/formschema/native/blob/master/LICENSE) file for more details.
