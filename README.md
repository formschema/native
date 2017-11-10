# vue-json-schema
Vue component form based on JSON Schema

[![Build Status](https://travis-ci.org/demsking/vue-json-schema.svg?branch=master)](https://travis-ci.org/demsking/vue-json-schema)

## Install
```sh
npm install --save vue-json-schema
```

## Demo
- [Demo with ElementUI](https://github.com/demsking/vue-json-schema-demo-elementui)

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
  <form-schema :schema="schema" v-model="model" @submit="submit">
    <button type="submit">Subscribe</button>
  </form-schema>
</template>

<script>
  import FormSchema from 'vue-json-schema'
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
    components: { FormSchema }
  }
</script>
```

## Use custom form elements
Use `FormSchema.setComponent(type, component[, props = {}])` to define custom element to use for rendering.
See [vue-json-schema-demo-elementui](https://github.com/demsking/vue-json-schema-demo-elementui) for a complete example.
```js
// an element-ui example

import FormSchema from 'vue-json-schema'
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

FormSchema.setComponent('label', FormItem)
FormSchema.setComponent('email', Input)
FormSchema.setComponent('text', Input)
FormSchema.setComponent('textarea', Input)
FormSchema.setComponent('checkbox', Checkbox)
FormSchema.setComponent('radio', Radio)
FormSchema.setComponent('select', Select)
FormSchema.setComponent('option', Option)

// Use the third argument to define props of the component
FormSchema.setComponent('button', Button, {
  type: 'primary',
  label: 'Subscribe'
})

// The third argument can also be a function that return an object
FormSchema.setComponent('form', Form, (vm) => {
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

  return { labelWidth, rules, model }
})

export default {
  data: () => ({
    schema: {...}
  }),
  // ...
  components: { FormSchema }
}
```

## Multiple Checkbox elements
To define multiple checkbox, use the [JSON Schema keyword `anyOf`](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.27):
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "multipleCheckbox": {
      "type": "array",
      "title": "Lists subscription",
      "anyOf": [
        { "value": "daily", "label": "Daily New" },
        { "value": "promotion", "label": "Promotion" }
      ]
    }
  }
}

```

## Grouped Radio elements
To group radio elements, use the [JSON Schema keyword `oneOf`](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.28):
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "groupedRadio": {
      "type": "array",
      "oneOf": [
        { "value": "daily", "label": "Daily New" },
        { "value": "promotion", "label": "Promotion" }
      ]
    }
  }
}

```

## License
Under the MIT license. See [LICENSE](https://github.com/demsking/vue-json-schema/blob/master/LICENSE) file for more details.
