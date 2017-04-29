# vue-json-schema

Vue component form based on JSON Schema

[![Build Status](https://travis-ci.org/demsking/vue-json-schema.svg?branch=master)](https://travis-ci.org/demsking/vue-json-schema)
[![bitHound Overall Score](https://www.bithound.io/github/demsking/vue-json-schema/badges/score.svg)](https://www.bithound.io/github/demsking/vue-json-schema)
[![bitHound Dependencies](https://www.bithound.io/github/demsking/vue-json-schema/badges/dependencies.svg)](https://www.bithound.io/github/demsking/vue-json-schema/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/demsking/vue-json-schema/badges/code.svg)](https://www.bithound.io/github/demsking/vue-json-schema)


## Install
```sh
npm install --save vue-json-schema
```

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

- `data-class-error` ***String*** (*optional*) `default: 'uk-form-danger'` 
### slots 
- `default` Use this slot to override the default form button 

### events 
- `change` Fired when an form input value is changed. 

- `invalid` Fired when a submittable element has been checked and doesn't satisfy its constraints. The validity of submittable elements is checked before submitting their owner form. 

- `submit` Fired when a form is submitted 

### methods 
- `input()` 
Get a form input component 

- `reset()` 
Reset the value of all elements of the parent form. 

- `submit()` 
Send the content of the form to the server 

- `setErrorMessage()` 
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
  import FormSchema from 'vue-form-schema'
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

## License

Under the MIT license. See [LICENSE](https://github.com/demsking/vue-json-schema/blob/master/LICENSE) file for more details.
