# FormSchema Native

Vue component form based on JSON Schema and Native HTML

[![npm](https://img.shields.io/npm/v/@formschema/native.svg)](https://www.npmjs.com/package/@formschema/native) [![Build status](https://gitlab.com/formschema/native/badges/master/build.svg)](https://gitlab.com/formschema/native/pipelines) [![Test coverage](https://gitlab.com/formschema/native/badges/master/coverage.svg)](https://gitlab.com/formschema/native/-/jobs)

## Install

```sh
npm install --save @formschema/native
```

## Demo

- [Demo with ElementUI](https://gitlab.com/formschema/elementui)

## FormSchema API

### props 

- `schema` ***Object*** (*required*) 

   The JSON Schema object. 

- `v-model` ***Object*** (*optional*)

   Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type. 

- `action` ***String*** (*optional*) 

   The URI of a program that processes the form information. 

- `autocomplete` ***String*** (*optional*) 

   This property indicates whether the value of the control can be automatically completed by the browser. Possible values are: `off` and `on`. 

- `enctype` ***String*** (*optional*) `default: 'application/x-www-form-urlencoded'` 

   When the value of the method attribute is post, enctype is the MIME type of content that is used to submit the form to the server. Possible values are: - application/x-www-form-urlencoded: The default value if the attribute is not specified. - multipart/form-data: The value used for an <input> element with the type attribute set to "file". - text/plain (HTML5) 

- `method` ***String*** (*optional*) `default: 'post'` 

   The HTTP method that the browser uses to submit the form. Possible values are: - post: Corresponds to the HTTP POST method ; form data are included in the body of the form and sent to the server. - get: Corresponds to the HTTP GET method; form data are appended to the action attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters. 

- `novalidate` ***Boolean*** (*optional*) 

   This Boolean attribute indicates that the form is not to be validated when submitted. 

### events 

- `input` 

   Fired synchronously when the value of an element is changed. 

- `change` 

   Fired when a change to the element's value is committed by the user. 

- `invalid` 

   Fired when a submittable element has been checked and doesn't satisfy its constraints. The validity of submittable elements is checked before submitting their owner form, or after the `checkValidity()` of the element or its owner form is called. 

- `submit` 

   Fired when a form is submitted 

### methods 

- `loadSchema(schema)` 

   Load the given JSON Schema. Use this to update the initial schema. 

- `form()` 

   Get the HTML form reference. 

- `reportValidity()` 

   Returns true if the element's child controls satisfy their validation constraints. When false is returned, cancelable invalid events are fired for each invalid child and validation problems are reported to the user. 

- `checkValidity()` 

   Checks whether the form has any constraints and whether it satisfies them. If the form fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns false. 

- `reset()` 

   Reset the value of all elements of the parent form. 

- `submit(event)` 

   Send the content of the form to the server. 

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
  import FormSchema from '@formschema/native'
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

## Async Schema

To asynchronously load a schema, just set a promise that returns it.

```html
<script>
  import axios from 'axios'
  import FormSchema from '@formschema/native'

  export default {
    data: () => ({
      schema: axios.get('/api/schema/subscription.json'),
    }),
    components: { FormSchema }
  }
</script>
```

## Use custom form elements

Use `FormSchema.setComponent(type, component[, props = {}])` to define custom element to use for rendering.

See [FormSchema ElementUI implementation](https://gitlab.com/formschema/elementui) for a complete example.

```js
// an element-ui example

import FormSchema from '@formschema/native'
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
FormSchema.setComponent('form', Form, ({ vm }) => {
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
FormSchema.setComponent('title', 'h2')

// By default `<p/>` is used to render the form description.
// To override this, use the `description` type:
FormSchema.setComponent('description', 'small')

// By default `<div/>` is used to render the message error.
// To override this, use the `error` type:
FormSchema.setComponent('error', 'el-alert', ({ vm }) => ({
  type: 'error',
  title: vm.error
}))

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
  import FormSchema from '@formschema/native'

  FormSchema.setComponent('select', 'el-select', ({ item }) => {
    return { label: item.value }
  })

  FormSchema.setComponent('checkboxgroup', 'el-checkbox-group')

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
  import FormSchema from '@formschema/native'

  FormSchema.setComponent('select', 'el-radio', ({ item }) => {
    return { label: item.value }
  })

  FormSchema.setComponent('radiogroup', 'el-radio-group')

  export default { ... }
</script>
```

## Array Inputs Elements

To render a [array field](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4), define your schema like:

**schema.json**

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "arrayInput": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}
```

**component.vue**

`formschema` will render a text input by adding a button to add more inputs.

```html
<script>
  import FormSchema from '@formschema/native'

  // To override the default array button props
  FormSchema.setComponent('arraybutton', 'button', {
    native: true, // required to force button rendering as HTML native element
    label: 'Add more item'
  })

  export default { ... }
</script>
```

## Regex Inputs

To render a [regex input](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3.3), define your schema like:

**schema.json**

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "regexInput": {
      "type": "string",
      "pattern": "[a-e]+"
    }
  }
}
```

### Working with Async Schema

You may want to use `FormSchema` with a schema loaded from a remote URL.
To do that, use the `loadSchema(schema)` method:

```html
<template>
  <form-schema ref="formSchema"/>
</template>

<script>
  import axios from 'axios'

  export default {
    created () {
      axios.get('/schema/newsletter.json').then(({ data }) => {
        this.$refs.formSchema.loadSchema(data)
      })
    }
  }
</script>
```

## License

Under the MIT license. See [LICENSE](https://gitlab.com/formschema/native/blob/master/LICENSE) file for more details.
