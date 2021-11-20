<template>
  <div class="playground">
    <aside class="playground__aside">
      <md-tabs class="playground__menu md-primary">
        <md-tab md-label="Schema">
          <md-field>
            <label>Schema</label>
            <md-select v-model="schemaKey">
              <template v-for="key in Object.keys(registry)">
                <md-option :key="key" :value="key">
                  {{ registry[key].name }}
                </md-option>
              </template>
            </md-select>
          </md-field>
          <md-content class="md-scrollbar">
            <PrismEditor
              class="playground__menu__editor editor"
              v-model="rawSchema"
              :highlight="highlighter"
              @change="setRawSchema"
              line-numbers/>
          </md-content>
        </md-tab>
        <md-tab md-label="Options">
          <div class="playground__menu__options">
            <md-field>
              <label>Components</label>
              <md-select v-model="components">
                <md-option value="vuematerial">VueMaterial</md-option>
                <md-option value="native">Native</md-option>
              </md-select>
            </md-field>
            <md-switch v-model="disabled">Disable Form</md-switch>
            <md-switch v-model="enableDescriptor">Enable Descriptor</md-switch>
            <md-switch v-model="enableCustomValidation">AJV Validation</md-switch>
          </div>
        </md-tab>
      </md-tabs>
    </aside>
    <md-tabs class="playground__render" :md-active-tab="activeTab" md-swipeable>
      <md-tab id="form" md-label="Rendering">
        <div class="playground__render__container">
          <div class="playground__render__container__form">
            <md-card>
              <md-card-header>
                Form
              </md-card-header>
              <md-card-content>
                <div ref="form">
                  <FormSchema v-bind="props" v-model="model" :disabled="disabled" :novalidate="enableCustomValidation" @input="onInput" @submit.prevent="onSubmit">
                    <div class="playground__render__form__buttons">
                      <button type="submit">Submit</button>
                      <button type="reset">Reset</button>
                    </div>
                  </FormSchema>
                </div>
              </md-card-content>
            </md-card>
          </div>
          <div class="playground__render__container__model">
            <md-card>
              <md-card-header>
                Model
              </md-card-header>
              <md-card-content>
                <PrismEditor
                  class="editor"
                  v-model="rawModel"
                  :highlight="highlighter"
                  readonly/>
                </md-card-content>
              </md-card>
          </div>
        </div>
      </md-tab>
      <md-tab id="html" md-label="Generated HTML">
        <PrismEditor
          class="editor"
          v-model="code"
          :highlight="highlighter"
          readonly
          line-numbers/>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
  import { html } from 'js-beautify';
  import { PrismEditor } from 'vue-prism-editor';
  import { highlight, languages } from 'prismjs/components/prism-core';

  import 'vue-prism-editor/dist/prismeditor.min.css';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-coy.css';

  import Ajv from 'ajv';
  import $RefParser from 'json-schema-ref-parser';

  import FormSchema, { NativeComponents } from 'FormSchema.esm.min.js';
  import createComponents from '../libs/VueMaterial';

  import InputHiddenSchema from '@/schema/input.hidden.schema';
  import InputHiddenDescriptor from '@/schema/input.hidden.descriptor';
  import ObjectRecursiveSchema from '@/schema/object.recursive.schema';
  import ObjectRecursiveDescriptor from '@/schema/object.recursive.descriptor';
  import NewsletterSchema from '@/schema/newsletter.schema';
  import NewsletterDescriptor from '@/schema/newsletter.descriptor';
  import ArraySchema from '@/schema/array';
  import NestedArraySchema from '@/schema/nestedarray.schema';
  import NumberSchema from '@/schema/number';
  import PersonalInfoSchema from '@/schema/personalinfo';
  import FacebookSignupSchema from '@/schema/facebook.signup.schema';
  import FacebookSignupDescriptor from '@/schema/facebook.signup.descriptor';

  export default {
    components: { PrismEditor, FormSchema },
    data: () => ({
      model: undefined,
      dereferencedSchema: {},
      code: '',
      formatter: null,
      disabled: false,
      enableDescriptor: true,
      enableCustomValidation: false,
      components: 'native',
      ajv: new Ajv({ allErrors: true }),
      customSchema: null,
      schemaKey: 'object',
      activeTab: 0,
      registry: {
        custom: {
          name: 'Custom Schema',
          schema: {},
          descriptor: {}
        },
        facebookSignup: {
          name: 'Facebook Signup',
          schema: FacebookSignupSchema,
          descriptor: FacebookSignupDescriptor
        },
        inputHidden: {
          name: 'Hidden Input',
          schema: InputHiddenSchema,
          descriptor: InputHiddenDescriptor
        },
        object: {
          name: 'Newsletter Signup',
          schema: NewsletterSchema,
          descriptor: NewsletterDescriptor
        },
        objectRecursive: {
          name: 'Recursive Object',
          schema: ObjectRecursiveSchema,
          descriptor: ObjectRecursiveDescriptor
        },
        array: {
          name: 'Array',
          schema: ArraySchema,
          descriptor: {}
        },
        dependencies: {
          name: 'Nested Array',
          schema: NestedArraySchema,
          descriptor: {}
        },
        number: {
          name: 'Number',
          schema: NumberSchema,
          descriptor: {}
        },
        personalinfo: {
          name: 'Object',
          schema: PersonalInfoSchema,
          descriptor: {}
        }
      }
    }),
    computed: {
      isCustomSchema() {
        return this.schemaKey === 'custom';
      },
      schema() {
        return this.registry[this.schemaKey].schema;
      },
      rawSchema() {
        return JSON.stringify(this.schema, null, 2);
      },
      parsedSchema() {
        return JSON.parse(this.rawSchema);
      },
      rawModel() {
        return JSON.stringify(this.model, null, 2);
      },
      componentsInstance() {
        switch (this.components) {
          case 'vuematerial':
            return createComponents(NativeComponents)

          default:
            return undefined;
        }
      },
      props() {
        return {
          id: 'form',
          schema: this.dereferencedSchema,
          validator: this.enableCustomValidation ? this.validator : undefined,
          components: this.componentsInstance,
          descriptor: this.enableDescriptor
            ? this.registry[this.schemaKey].descriptor
            : undefined
        };
      },
      validate() {
        return this.ajv.compile(this.dereferencedSchema);
      }
    },
    watch: {
      parsedSchema(value) {
        this.model = undefined;

        this.dereferenceSchema();
      }
    },
    created() {
      this.dereferenceSchema();
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.js);
      },
      setRawSchema(value) {
        try {
          this.model = undefined;
          this.registry.custom.schema = JSON.parse(value);
          this.schemaKey = 'custom';
        } catch(e) {}
      },
      dereferenceSchema() {
        $RefParser.dereference(this.parsedSchema)
          .then((schema) => {
            this.dereferencedSchema = schema;
          })
          .catch((err) => console.error(err));
      },
      generateCode() {
        setTimeout(() => {
          this.code = html(this.$refs.form.innerHTML.replace(/<!---->/g, ''), {
            indent_size: 2
          });
        }, 300);
      },
      onInput() {
        this.generateCode();
      },
      onSubmit({ field }) {
        if (this.enableCustomValidation && field && !this.validator(field)) {
          return;
        }

        // submit code here
        alert('Submited');
      },
      validator(field) {
        field.clearMessages(true);

        const validate = field.schema === this.dereferencedSchema
          ? this.validate
          : this.ajv.compile(field.schema);

        if (!validate(field.value)) {
          this.validate.errors.forEach(({ dataPath, message }) => {
            const errorField = field.hasChildren
              ? field.getField(dataPath) || field
              : field;

            errorField.addMessage(message, 3);
          });

          return Promise.resolve(false);
        }

        return Promise.resolve(true);
      },
      updateForm() {
        this.activeTab = 'form';

        this.$forceUpdate();
      }
    }
  }
</script>

<style lang="stylus">
  .playground
    display: flex
    flex-direction: row
    position: relative
    width: 100vw
    height: 100vh
    overflow: hidden
    background-color: #fff

    &__aside
      //

    .editor
      font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace
      font-size: 14px
      line-height: 1.5
      padding: 0

    &__menu
      position: relative
      z-index: 1
      width: 30vw
      box-shadow: 0 0 10px 0 rgb(136 152 170, .9)

      &__editor
        //

      &__options
        display: flex
        flex-direction: column

    &__render
      flex: 1

      &__container
        display: flex
        flex-direction: row
        gap: 15px

        &__form
          //

        &__model
          // flex: 1

  fieldset
    border: none
    padding: 10px 0
    margin-bottom: 10px

  form > fieldset
    & > legend
      font-size: 1.7em
      text-align: center
      margin-top: 0
      margin-bottom: .2em

    & > p // main description
      text-align: center
      margin-top: 0
      margin-bottom: 1.5em

    [data-fs-kind="object"]
      & > legend
        display: block
        font-size: 14px
        text-align: left
        width: 100%
        padding: 0 0 2px

    input, textarea, select
      display: block

  [data-fs-kind]
    flex: 1
    display: flex
    flex-direction: row
    margin-bottom: 5px

    & > label, & > legend
      display: block
      width: 120px
      min-width: 120px
      text-align: right
      margin-right: 10px

      &:active
        outline: none

  [data-fs-horizontal] > [data-fs-wrapper] > [data-fs-input]
    flex-direction: row

    & > [data-fs-kind]
      width: 55px

      input, select, textarea
        width: @width

  [data-fs-input]
    display: flex
    flex-direction: column
    align-items: flex-start

    select
      & > md-option[value=""]:first-child
        color: #666

  [data-fs-helper]
    color: rgba(0, 0, 0, .6)

  [data-fs-message]
    //

  // Message Info
  [data-fs-message='0']
    color: inherit

  // Message Success
  [data-fs-message='1']
    color: green

  // Message Warning
  [data-fs-message='2']
    color: orange

  // Message Error
  [data-fs-message='3']
    color: red

  [data-fs-input="object"]
    & > [data-fs-kind]
      flex-direction: column

      label
        text-align: left
        flex: 1

  [data-fs-input="enum"]
    & > [data-fs-kind]
      flex-direction: row-reverse

      label
        text-align: left
        flex: 1

  [data-fs-input="array"]
    & > [data-fs-kind]
      flex-direction: column

      label
        text-align: left

    & > [data-fs-type="radio"]
    & > [data-fs-type="checkbox"]
      flex-direction: row-reverse

    & > [data-fs-input]
      margin-bottom: 5px

      & > *
        margin-left: 0
</style>
