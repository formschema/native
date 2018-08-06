# FormSchema Native

Vue component form based on JSON Schema and Native HTML

[![npm](https://img.shields.io/npm/v/@formschema/native.svg)](https://www.npmjs.com/package/@formschema/native) [![Build status](https://gitlab.com/formschema/native/badges/master/build.svg)](https://gitlab.com/formschema/native/pipelines) [![Test coverage](https://gitlab.com/formschema/native/badges/master/coverage.svg)](https://gitlab.com/formschema/native/-/jobs)

## Install

```sh
npm install --save @formschema/native
```

## Demo

- [Demo with ElementUI](https://gitlab.com/formschema/components/elementui)

## FormSchema API

### props 

- `schema` ***Object*** (*optional*) `default: {}`

  The JSON Schema object. 

- `v-model` ***Number|String|Array|Object|Boolean*** (*optional*) `default: undefined` 

  Use this directive to create two-way data bindings with the
  component. It automatically picks the correct way to update the
  element based on the input type. 

- `action` ***String*** (*optional*) 

  The URI of a program that processes the form information. 

- `autocomplete` ***String*** (*optional*) 

  This property indicates whether the value of the control can be
  automatically completed by the browser.
  
  Possible values are: `off` and `on`. 

- `enctype` ***String*** (*optional*) `default: 'application/x-www-form-urlencoded'` 

  When the value of the method attribute is post, enctype is the
  MIME type of content that is used to submit the form to the
  server.
  
  Possible values are:
  - application/x-www-form-urlencoded: The default value if the
  attribute is not specified.
  - multipart/form-data: The value used for an `<input/>` element
  with the type attribute set to "file".
  - text/plain (HTML5) 

- `method` ***String*** (*optional*) `default: 'post'` 

  The HTTP method that the browser uses to submit the form.
  
  Possible values are:
  - `post`: Corresponds to the HTTP POST method ; form data are
  included in the body of the form and sent to the server.
  - `get`: Corresponds to the HTTP GET method; form data are
  appended to the action attribute URI with a '?' as separator,
  and the resulting URI is sent to the server. Use this method
  when the form has no side-effects and contains only ASCII
  characters. 

- `novalidate` ***Boolean*** (*optional*) 

  This Boolean attribute indicates that the form is not to be
  validated when submitted. 

- `components` ***Components*** (*optional*) `default: GLOBAL.components`

  Use this prop to overwrite the default Native HTML Elements for
  custom components. 

### events 

- `change` 

  Fired when a change to the element's value is committed
  by the user. 

- `input` 

  Fired synchronously when the value of an element is changed. 

- `invalid` 

  Fired when a submittable element has been checked and doesn't
  satisfy its constraints. The validity of submittable elements is
  checked before submitting their owner form, or after the
  `checkValidity()` of the element or its owner form is called. 

- `submit` 

  Fired when a form is submitted 

### methods 

- `load(schema, model)` 

  Load the given `schema` with initial filled `value`.
  Use this to load async schema. 

  **parameters:** 

     - `schema` **object** - The JSON Schema object to load 
     - `model` **Number|String|Array|Object|Boolean** - The initial data for the schema. 

- `form()` 

  Get the HTML form reference. 

- `reportValidity()` 

  Returns true if the element's child controls satisfy their
  validation constraints. When false is returned, cancelable invalid
  events are fired for each invalid child and validation problems
  are reported to the user. 

- `checkValidity()` 

  Checks whether the form has any constraints and whether it
  satisfies them. If the form fails its constraints, the browser
  fires a cancelable `invalid` event at the element, and then
  returns false. 

- `reset()` 

  Reset the value of all elements of the parent form. 

- `submit(event)` 

  Send the content of the form to the server. 

- `setErrorMessage(message)` 

  Set a message error. 

- `clearErrorMessage()` 

  clear the message error. 

## Usage

In your Vue file:

```html
<template>
  <FormSchema :schema="schema" v-model="model" @submit="submit">
    <button type="submit">Subscribe</button>
  </FormSchema>
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
  "required": ["name", "email", "lists"]
}
```

### Working with Async Schema

You may want to use `FormSchema` with a schema loaded from a remote URL.

To do that, use the `load(schema[, value = undefined])` method:

```html
<template>
  <!-- set a reference to your FormSchema instance -->
  <FormSchema ref="formSchema"/>
</template>

<script>
  import axios from 'axios'
  import FormSchema from '@formschema/native'

  export default {
    created () {
      axios.get('/api/schema/subscription.json').then(({ data }) => {
        this.$refs.formSchema.load(data)
      })
    },
    components: { FormSchema }
  }
</script>
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

`FormSchema` will render a text input by adding a button to add more inputs.

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

## Custom Form Elements

To define custom element for rendering, the `components` prop:

See [FormSchema ElementUI integration](https://gitlab.com/formschema/components/elementui) for a complete example.

**TODO:** Add example code here

## License

Under the MIT license. See [LICENSE](https://gitlab.com/formschema/native/blob/master/LICENSE) file for more details.
