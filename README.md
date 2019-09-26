# FormSchema Native

Vue component form based on JSON Schema and Native HTML

[![npm](https://img.shields.io/npm/v/@formschema/native.svg)](https://www.npmjs.com/package/@formschema/native) [![Build status](https://gitlab.com/formschema/native/badges/master/build.svg)](https://gitlab.com/formschema/native/pipelines) [![Test coverage](https://gitlab.com/formschema/native/badges/master/coverage.svg)](https://gitlab.com/formschema/native/-/jobs)

> This is the branch for @formschema/native 2.0 Alpha, not ready for production.
  For the 1x version, please switch to the [v1](https://gitlab.com/formschema/native/tree/v1) branch.

## Status: Alpha

Core features are not ready and the API could changed. Don't use this in production.

## Table of Contents

- [Status: Alpha](#status-alpha)
- [Install](#install)
- [Demo](#demo)
- [Usage](#usage)
- [Features](#features)
- [Supported Keywords](#supported-keywords)
- [Irrelevant (ignored) Keywords](#irrelevant-ignored-keywords)
- [FormSchema API](#formschema-api)
  * [props](#props)
  * [events](#events)
  * [methods](#methods)
- [Working with Async Schema](#working-with-async-schema)
- [Working with Vue Router](#working-with-vue-router)
- [Workind with JSON Schema $ref Pointers](#workind-with-json-schema-ref-pointers)
- [Render Form Elements](#render-form-elements)
  * [Textarea](#textarea)
  * [File Input](#file-input)
  * [Hidden Input](#hidden-input)
  * [Password Input](#password-input)
  * [Multiple Checkbox](#multiple-checkbox)
  * [Grouped Radio](#grouped-radio)
  * [Select Input](#select-input)
  * [Array Input](#array-input)
  * [Regex Input](#regex-input)
  * [Fieldset Element](#fieldset-element)
- [Custom Form Elements](#custom-form-elements)
- [Data Validation](#data-validation)
  * [Native HTML5 Validation](#native-html5-validation)
  * [Custom Validation API](#custom-validation-api)
  * [Custom Validation with AJV](#custom-validation-with-ajv)
  * [Disable Native HTML5 Validation](#disable-native-html5-validation)
- [Translate Labels](#translate-labels)
- [Descriptor Interface](#descriptor-interface)
- [Contributing](#contributing)
- [License](#license)

## Install

```sh
npm install --save @formschema/native
```

## Demo

- [Demo with ElementUI](https://gitlab.com/formschema/components/elementui)

![formschema-demo-elementui](https://gitlab.com/formschema/components/elementui/raw/master/screenshot.png "FormSchema Demo with ElementUI")

## Usage

```html
<template>
  <FormSchema :schema="schema" v-model="model" @submit.prevent="submit">
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

## Features

- [Keywords for Applying Subschemas With Boolean Logic](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7)
- [Validation Keywords for Any Instance Type](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1)<br>
  FormSchema uses:
  - HTML input `text` to render schema with `type: 'string'`
  - HTML input `number` to render schema with `type: 'number' | 'integer'`
  - HTML input `hidden` to render schema with `type: 'null'`
  - HTML input `checkbox` to render schema with `type: 'boolean'`
- [Validation Keywords for Numeric Instances (number and integer)](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2)<br>
  FormSchema parses keywords `maximum`, `minimum`, `exclusiveMaximum` and `exclusiveMinimum` to generate HTML attributes `max` and `min`.
- [Validation Keywords for Strings](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3)<br>
  FormSchema parses keywords `maxLength`, `minLength`, `pattern` to generate HTML attributes `maxlength`, `minlength` and `pattern`.
- [Validation Keywords for Arrays](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4)
- [Semantic Validation With "format"](https://json-schema.org/latest/json-schema-validation.html#rfc.section.7)<br>
  FormSchema uses:
  - HTML input `date` to render schema with `format: 'date'`
  - HTML input `datetime-local` to render schema with `format: 'date-time'`
  - HTML input `email` to render schema with `format: 'email' | 'idn-email'`
  - HTML input `time` to render schema with `format: 'time'`
  - HTML input `url` to render schema with `format: 'uri'`
- [String-Encoding Non-JSON Data](https://json-schema.org/latest/json-schema-validation.html#rfc.section.8)
- [Property dependencies and Schema dependencies](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.7)
- [Schema Re-Use With "definitions"](https://json-schema.org/latest/json-schema-validation.html#rfc.section.9) (see [JSON Schema $ref Pointers](#json-schema-ref-pointers))
- [Schema Annotations](https://json-schema.org/latest/json-schema-validation.html#rfc.section.10)

## Supported Keywords

- [type](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1.1) is only supported string value. Array type definition is not supported.
- [enum](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1.2) is used to render multiple choices input
- [maximum](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.2), [exclusiveMaximum](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.3), [minimum](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.4) and [exclusiveMinimum](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.5) are used to render numeric fields
- [multipleOf](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.1) is used to render the input attribute `step`
- [maxLength](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3.1), [minLength](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3.2), [pattern](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3.3) and [const](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1.3) are used to render string fields
- [items](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4.1), [additionalItems](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4.2), [maxItems](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4.3), [minItems](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4.4) and [uniqueItems](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4.5) are used to render array fields
- [dependencies](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.7) is used to implement *Property dependencies* and *Schema dependencies*
- [contentEncoding](https://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3)
- [contentMediaType](https://json-schema.org/latest/json-schema-validation.html#rfc.section.8.4)<br>
  - When `contentMediaType` is equal to `text/*`, the HTML element `<textarea/>` is used for rendering
  - When `contentMediaType` is not equal to `text/*`, the HTML element `<input/>` with attributes `{ type: file, accept: contentMediaType }` is used for rendering
- [title](https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.1) is used to render the input label
- [description](https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.1) is used to render the input description
- [default](https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.2) is used to define the default input value
- [readOnly](https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.3) is used to render a field as an read-only input

## Irrelevant (ignored) Keywords

Since FormSchema is just a form generator, some JSON Schema validation keywords
are irrelevant:

- [contains](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4.6)
- [maxProperties](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.1)
- [minProperties](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.2)
- [patternProperties](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.5)
- [additionalProperties](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.6)
- [propertyNames](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.8)
- [not](https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7.4)
- [writeOnly](https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.3)
- [examples](https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.4)

## FormSchema API

### props

- `schema` ***Object*** (*required*)

  The input JSON Schema object.

- `v-model` ***Number|String|Array|Object|Boolean*** (*optional*) `default: undefined`

  Use this directive to create two-way data bindings with the
  component. It automatically picks the correct way to update the
  element based on the input type.

- `id` ***String*** (*optional*)

  The id property of the Element interface represents the form's identifier,
  reflecting the id global attribute.

- `name` ***String*** (*optional*) `default: undefined`

  The name of the form. It must be unique among the forms in a document.

- `bracketed-object-input-name` ***Boolean*** (*optional*) `default: true`

  When set to true (default), checkbox inputs will automatically include
  brackets at the end of their names (e.g. name="Multicheckbox-Value1[]".
  Setting this property to false, disables this behaviour.

- `search` ***Boolean*** (*optional*) `default: false`

  Use this prop to enable `search` landmark role to identify a section
  of the page used to search the page, site, or collection of sites.

- `disabled` ***Boolean*** (*optional*) `default: false`

  Indicates whether the form elements are disabled or not.

- `components` ***Components*** (*optional*) `default: GLOBAL.components`

  Use this prop to overwrite the default Native HTML Elements with
  custom components.

### events

- `input`

  Fired synchronously when the value of an element is changed.

### methods

- `form()`

  Get the HTML form reference.

   **return value:**

     - **HTMLFormElement|VNode|undefined** -  Returns the HTML form element or `undefined` for empty object

## Working with Async Schema

```html
<template>
  <FormSchema v-model="schema"/>
</template>

<script>
  import axios from 'axios'
  import FormSchema from '@formschema/native'

  export default {
    components: { FormSchema },
    data: () => ({
      schema: {}
    }),
    created() {
      axios.get('/api/schema/subscription.json').then(({ data: schema }) => {
        this.schema = schema
      });
    }
  };
</script>
```

## Working with Vue Router

Load an async schema on the `beforeRouterEnter` hook:

```html
<template>
  <FormSchema v-model="schema"/>
</template>

<script>
  import axios from 'axios'
  import FormSchema from '@formschema/native'

  export default {
    components: { FormSchema },
    data: () => ({
      schema: {}
    }),
    beforeRouterEnter(from, to, next) {
      axios.get('/api/schema/subscription.json')
        .then(({ data: schema }) => next((vm) => vm.setSchema(schema)))
        .catch(next);
    },
    methods: {
      setSchema(schema) {
        this.schema = schema;
      }
    }
  };
</script>
```

## Workind with JSON Schema $ref Pointers

To load a JSON Schema with `$ref` pointers, you need to install an additional dependency to resolve them:

```js
import $RefParser from 'json-schema-ref-parser';
import FormSchema from '@formschema/native';
import schemaWithPointers from './schema/with-pointers.json';

export default {
  components: { FormSchema },
  data: () => ({
    schema: {}
  }),
  created () {
    $RefParser.dereference(schemaWithPointers)
      .then((schema) => {
        // `schema` is the resolved schema that contains your entire JSON
        // Schema, including referenced files, combined into a single object
        this.schema = schema;
      });
  }
}
```

See [json-schema-ref-parser documentation page](https://www.npmjs.com/package/json-schema-ref-parser) for more details.

## Render Form Elements

### Textarea

Add a `text/*` media types to a string schema to render a Textarea element.

**Example schema.json**

```json
{
  "type": "string",
  "contentMediaType": "text/plain"
}
```

You can also use a descriptor to force the Render to use a Textarea
element:

**Example descriptor.json**

```json
{
  "kind": "textarea"
}
```

### File Input

String schemas with media types not starting with `text/*` are automatically render as Input File elements.

**Example schema.json**

```json
{
  "type": "string",
  "contentMediaType": "image/png"
}
```

> There is a list of [MIME types officially registered by the IANA](http://www.iana.org/assignments/media-types/media-types.xhtml),
  but the set of types supported will be application and operating system
  dependent. Mozilla Developer Network also maintains a
  [shorter list of MIME types that are important for the web](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types).

### Hidden Input

Schemas with descriptor's kind `hidden` are render as hidden input elements.

**Example schema.json**

```json
{
  "type": "string"
}
```

**Example descriptor.json**

```json
{
  "kind": "hidden"
}
```

### Password Input

String schemas with a descriptor's kind `password` are used to render Input
Password elements.

**Example schema.json**

```json
{
  "type": "string"
}
```

**Example descriptor.json**

```json
{
  "kind": "password"
}
```

### Multiple Checkbox

To define multiple checkbox, use the [JSON Schema keyword `anyOf`](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.27):

**Example schema.json**

```json
{
  "type": "object",
  "properties": {
    "multipleCheckbox": {
      "type": "array",
      "anyOf": [
        "daily",
        "promotion"
      ]
    }
  }
}
```

### Grouped Radio

To group radio elements, use the [JSON Schema keyword `enum`](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.23)
with a `enum` descriptor:

**Example schema.json**

```json
{
  "type": "string",
  "enum": [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ]
}
```

**Example descriptor.json**

```json
{
  "kind": "enum",
  "items": {
    "monday": { "label": "Monday" },
    "tuesday": { "label": "Tuesday" },
    "wednesday": { "label": "Wednesday" },
    "thursday": { "label": "Thursday" },
    "friday": { "label": "Friday" },
    "saturday": { "label": "Saturday" },
    "sunday": { "label": "Sunday" }
  }
}
```

### Select Input

To group HTML Select element, use the [JSON Schema keyword `enum`](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.23)
with a `list` descriptor:

**Example schema.json**

```json
{
  "type": "string",
  "enum": [
    "monday",
    "tuesday",
    "wednesday",
    "thruday",
    "friday",
    "saturday",
    "sunday"
  ]
}
```

**Example descriptor.json**

```json
{
  "kind": "list"
}
```

### Array Input

To render a [array field](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4), define your schema like:

**Example schema.json**

```json
{
  "type": "array",
  "items": {
    "type": "string"
  }
}
```

`FormSchema` will render a text input by adding a button to add more inputs.

### Regex Input

To render a [regex input](http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3.3),
define your schema like:

**Example schema.json**

```json
{
  "type": "string",
  "pattern": "[a-e]+"
}
```

### Fieldset Element

FormSchema use a `<fieldset>` element to group inputs of a object JSON Schema:

**Example schema.json**

```json
{
  "type": "object",
  "properties": {
    "firstname": {
      "type": "string"
    },
    "lastname": {
      "type": "string"
    }
  },
  "required": ["firstname"]
}
```

Use descriptor to set labels and helpers. You can also change the order of
properties for the rendering:

**Example descriptor.json**

```json
{
  "properties": {
    "firstname": {
      "label": "First Name",
      "helper": "Your first name"
    },
    "lastname": {
      "label": "Last Name",
      "helper": "Your last name"
    }
  },
  "order": ["lastname", "firstname"]
}
```

## Custom Form Elements

To define custom elements for rendering, you need to use the `Components` class and the `components` prop:

```js
// MyCustomElements.js

import { Components } from '@formschela/native';
import { InputElement } from '@/components/InputElement';
import { ArrayElement } from '@/components/ArrayElement';
import { FieldsetElement } from '@/components/FieldsetElement';
import { ListElement } from '@/components/ListElement';
import { TextareaElement } from '@/components/TextareaElement';
import { StateElement } from '@/components/StateElement';

export const MyCustomElements = new Components();

MyCustomElements.set('array', ArrayElement);
MyCustomElements.set('string', InputElement);
MyCustomElements.set('boolean', StateElement);
MyCustomElements.set('radio', StateElement);
MyCustomElements.set('checkbox', StateElement);
MyCustomElements.set('enum', FieldsetElement);
MyCustomElements.set('number', InputElement);
MyCustomElements.set('integer', InputElement);
MyCustomElements.set('object', FieldsetElement);
MyCustomElements.set('list', ListElement);
MyCustomElements.set('textarea', TextareaElement);
```

See the file [NativeElements.ts](https://gitlab.com/formschema/native/blob/master/src/lib/NativeElements.ts) for an example.

```html
<template>
  <FormSchema v-model="model" :schema="schema" :components="components"/>
</template>

<script>
  import FormSchema from '@formschema/native'
  import { MyCustomElements } from './MyCustomElements'

  export default {
    data: () => ({
      schema: { /* ... */ },
      components: MyCustomElements,
      model: {}
    }),
    components: { FormSchema }
  }
</script>
```

[**ElementUI Example**](https://gitlab.com/formschema/components/elementui)

- Definition: https://gitlab.com/formschema/components/elementui/blob/master/lib/ElementUIComponents.js
- Usage: https://gitlab.com/formschema/components/elementui/blob/master/playground/src/components/Subscription.vue

## Data Validation

### Native HTML5 Validation

By default, FormSchema uses basic HTML5 validation by applying validation
attributes on inputs. This is enough for simple schema, but you will need to
dedicated JSON Schema validator if you want to validate complex schema.

### Custom Validation API

```ts
/**
 * FormSchema prop to set to enable custom validation
 * @param {Field} field - The field that requests validation
 * @return {boolean} Return `true` to accept changes and perform the `input` event,
 *                   or `false` to cancel the `input` event.
 */
type validator = (field: Field) => boolean;

interface Field {
  readonly value: any;
  readonly hasChildren: boolean;
  readonly messages: Message[];
  getField?: (path: string) => Field | null;
  addMessage: (message: string, type: MessageType = MessageError) => void;
  clearMessages: (recursive?: boolean) => void;
}

type MessageInfo = 0;
type MessageSuccess = 1;
type MessageWarining = 2;
type MessageError = 3;

type MessageType = MessageInfo | MessageSuccess | MessageWarining | MessageError;

interface Message {
  type: MessageType;
  text: string;
}
```

### Custom Validation with AJV

Bellow a basic example with the popular
[AJV](https://www.npmjs.com/package/ajv) validator:

```html
<template>
  <FormSchema v-model="model" :schema="schema" :validator="validator"/>
</template>

<script>
  import Ajv from 'ajv';
  import FormSchema from '@formschema/native';

  export default {
    data: () => ({
      schema: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            minLength: 5
          },
          password: {
            type: 'string',
            minLength: 6
          }
        },
        required: ['username', 'password']
      },
      model: {},
      ajv: new Ajv({ allErrors: true })
    }),
    computed: {
      validate() {
        return this.ajv.compile(this.schema);
      }
    },
    methods: {
      onSubmit({ field }) {
        if (field && this.validator(field)) {
          // validation success, submit code here
        }
      },
      validator(data, field) {
        // Clear all messages
        field.clearMessages(true);

        if (!this.validate(this.model)) {
          this.validate.errors.forEach(({ dataPath, message }) => {
            const errorField = field.hasChildren
              ? field.getField(dataPath) || field
              : field;

            /**
             * Add a message to `errorField`.
             * The first argument is the message string
             * and the second one the message type:
             *    0 - Message Info
             *    1 - Message Success
             *    2 - Message Warning
             *    3 - Message Error
             */
            errorField.addMessage(message, 3);
          });

          // Return `false` to cancel the `input` event
          return false;
        }

        // Return `true` to trigger the `input` event
        return true;
      }
    },
    components: { FormSchema }
  };
</script>
```

### Disable Native HTML5 Validation

Since FormSchema use the native HTML Form element, attributes `novalidate` and
`formvalidate` can be used to disable form validation as it described in the
[W3C specification](https://dev.w3.org/html5/spec-LC/association-of-controls-and-forms.html#attr-fs-novalidate):

> If present, they indicate that the form is not to be validated during
  submission.<br>
  The **no-validate state** of an element is true if the element is a
  [submit button](https://dev.w3.org/html5/spec-LC/forms.html#concept-submit-button)
  and the element's `formnovalidate` attribute is present, or if the element's
  [form owner](https://dev.w3.org/html5/spec-LC/association-of-controls-and-forms.html#form-owner)'s
  `novalidate` attribute is present, and `false` otherwise.

**Example: Disable Form Validation using `novalidate`**

```html
<template>
  <FormSchema v-model="model" :schema="schema" novalidate>
    <button type="submit">Submit</button>
  </FormSchema>
</template>
```

**Usecase: Implement Save, Cancel and Submit**

Disable the form validation constraints could be useful when implementing a
*save* feature to the form:

- The user should be able to save their progress even though they haven't fully entered the data in the form
- The user should be able to cancel the saved form data
- The user should be able to submit form data with validation

```html
<template>
  <FormSchema v-model="model" :schema="schema" action="/api/blog/post" method="post">
    <input type="submit" name="submit" value="Submit">
    <input type="submit" formnovalidate name="save" value="Save">
    <input type="submit" formnovalidate name="cancel" value="Cancel">
  </FormSchema>
</template>
```

## Translate Labels

The simple way to translate labels without change the JSON Schema file is to
use a descriptor.

Here an example with [Vue I18n](https://kazupon.github.io/vue-i18n):

```html
<template>
  <FormSchema v-model="model" :schema="schema" :descriptor="descriptor"/>
</template>

<script>
  import FormSchema from '@formschema/native';

  export default {
    data: () => ({
      schema: {
        type: 'object',
        properties: {
          firstname: {
            type: 'string'
          },
          lastname: {
            type: 'string'
          }
        }
      },
      model: {}
    }),
    computed: {
      descriptor() {
        properties: {
          firstname: {
            label: this.$t('firstname.label'),
            helper: this.$t('firstname.helper')
          },
          lastname: {
            label: this.$t('lastname.label'),
            helper: this.$t('lastname.helper')
          }
        }
      }
    },
    // `i18n` option, setup locale info for component
    // see https://kazupon.github.io/vue-i18n/guide/component.html
    i18n: {
      messages: {
        en: {
          firstname: {
            label: 'First Name',
            helper: 'Your First Name'
          },
          lastname: {
            label: 'Last Name',
            helper: 'Your Last Name'
          }
        },
        fr: {
          firstname: {
            label: 'Prénom',
            helper: 'Votre prénom'
          },
          lastname: {
            label: 'Nom',
            helper: 'Votre nom'
          }
        }
      }
    },
    components: { FormSchema }
  };
</script>
```

## Descriptor Interface

```ts
export type SchemaType = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
export type ScalarKind = 'string' | 'password' | 'number' | 'integer' | 'null' | 'boolean' | 'hidden' | 'textarea' | 'image' | 'file' | 'radio' | 'checkbox';
export type ItemKind = 'enum' | 'list';
export type FieldKind = SchemaType | ScalarKind | ItemKind;
export type Component = string | VueComponent | AsyncComponent;

export type DescriptorInstance = ScalarDescriptor | EnumDescriptor | ListDescriptor | ObjectDescriptor | ArrayDescriptor;

export interface Descriptor<TKind extends FieldKind = FieldKind> {
  kind?: TKind;
  label?: string;
  helper?: string;
  component?: Component;
  attrs?: {
    [attr: string]: unknown;
  };
  props?: {
    [prop: string]: unknown;
  };
}

/**
 * Describe scalar types like: string, password, number, integer,
 * boolean, null, hidden field, textarea element, image and file
 * inputs, radio and checkbox elements
 */
export interface ScalarDescriptor extends Descriptor<ScalarKind> {
}

/**
 * Use to describe grouped object properties
 */
export interface ObjectGroupDescriptor extends Descriptor {
  properties: string[];
}

/**
 * Describe JSON Schema with type `object`
 */
export interface ObjectDescriptor extends Descriptor {
  properties?: {
    [schemaProperty: string]: DescriptorInstance;
  };
  order?: string[];
  groups?: {
    [groupId: string]: ObjectGroupDescriptor;
  };
}

/**
 * Describe JSON Schema with key `enum`
 */
export interface ItemsDescriptor<TKind extends ItemKind> extends Descriptor<TKind> {
  items?: {
    [itemValue: string]: ScalarDescriptor;
  };
}

/**
 * Describe HTML Radio Elements
 */
export interface EnumDescriptor extends ItemsDescriptor<'enum'> {
}

/**
 * Describe HTML Select Element
 */
export interface ListDescriptor extends ItemsDescriptor<'list'> {
}

/**
 * Describe buttons for array schema
 */
export interface ButtonDescriptor<T extends Function> extends ActionButton<T> {
  type: string;
  label: string;
  tooltip?: string;
}

/**
 * Describe JSON Schema with type `array`
 */
export interface ArrayDescriptor extends Descriptor {
  items?: DescriptorInstance[] | DescriptorInstance;
  pushButton: ButtonDescriptor<ActionPushTrigger>;
  buttons: {
    moveUp: ButtonDescriptor<ActionMoveTrigger>;
    moveDown: ButtonDescriptor<ActionMoveTrigger>;
    delete: ButtonDescriptor<ActionDeleteTrigger>;
  };
}
```

## Contributing

Please see [contributing guide](https://gitlab.com/formschema/native/blob/master/CONTRIBUTING.md).

## License

Under the MIT license. See [LICENSE](https://gitlab.com/formschema/native/blob/master/LICENSE) file for more details.
