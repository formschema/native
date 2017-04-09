# vue-json-schema
Vue component form based on JSON Schema

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![Build Status](https://travis-ci.org/demsking/vue-json-schema.svg?branch=master)](https://travis-ci.org/demsking/vue-json-schema)
[![bitHound Overall Score](https://www.bithound.io/github/demsking/vue-json-schema/badges/score.svg)](https://www.bithound.io/github/demsking/vue-json-schema)
[![bitHound Dependencies](https://www.bithound.io/github/demsking/vue-json-schema/badges/dependencies.svg)](https://www.bithound.io/github/demsking/vue-json-schema/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/demsking/vue-json-schema/badges/code.svg)](https://www.bithound.io/github/demsking/vue-json-schema)

## Install
```sh
npm install --save vue-json-schema
```

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
  import FormSchema from 'vue-components-form/components/form-schema.vue'
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
