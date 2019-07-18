<template>
  <div class="playground">
    <div class="playground__input">
      <div class="playground__input__schema">
        <h2>Schema</h2>
        <div class="playground__input__schema__editor">
          <PrismEditor
            :code="rawSchema"
            language="json"
            @change="setRawSchema"/>
        </div>
      </div>
      <div class="playground__input__rendering">
        <h2>Rendering</h2>
        <div class="playground__input__rendering__viewport">
          <div class="playground__input__rendering__viewport__options">
            <label>
              <input type="checkbox" v-model="disabled" @change="updateRenderKey">
              <span>Disable whole form</span>
            </label>
            <label>
              <input type="checkbox" v-model="search" @change="updateRenderKey">
              <span>Search</span>
            </label>
            <label>
              <input type="checkbox" v-model="enableDescriptor" @change="updateRenderKey">
              <span>Enable Descriptor</span>
            </label>
          </div>
          <div ref="form" class="playground__input__rendering__viewport__card" :key="renderKey">
            <FormSchema v-bind="props" v-model="model" @input="generateCode" @submit.prevent>
              <div class="playground__input__rendering__viewport__card__buttons">
                <button type="submit">Submit</button>
                <button type="reset">Reset</button>
              </div>
            </FormSchema>
          </div>
        </div>
      </div>
      <div class="playground__input__model">
        <h2>Model</h2>
        <div class="playground__input__model__value">
          <PrismEditor :code="rawModel" language="json" readonly/>
        </div>
      </div>
    </div>
    <div class="playground__output">
      <h2>Generated HTML</h2>
      <div class="playground__output__code">
        <PrismEditor :code="code" language="html" readonly/>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/libs/Prism';
  import '@/styles/Prism.css';

  import { html } from 'js-beautify';
  import $RefParser from 'json-schema-ref-parser';

  import PrismEditor from 'vue-prism-editor';
  import FormSchema, { UniqueId } from '../../../dist/FormSchema.esm.min.js';
  import Schema from '@/schema/newsletter';

  export default {
    components: { PrismEditor, FormSchema },
    data: () => ({
      model: undefined,
      rawSchema: JSON.stringify(Schema, null, 2),
      schema: {},
      code: '',
      formatter: null,
      disabled: false,
      search: false,
      renderKey: UniqueId.get('code'),
      modelKey: UniqueId.get('model'),
      enableDescriptor: true,
      descriptor: {
        properties: {
          name: {
            properties: {
              first_name: {
                attrs: {
                  placeholder: 'Your First Name',
                  title: 'Please enter your first name'
                }
              },
              middle_name: {
                attrs: {
                  placeholder: 'Your Middle Name',
                  title: 'Please enter your middle name'
                }
              },
              last_name: {
                attrs: {
                  placeholder: 'Your Last Name',
                  title: 'Please enter your last name'
                }
              }
            }
          },
          email: {
            attrs: {
              placeholder: 'Your Email',
              title: 'Please enter your email'
            }
          },
          day: {
            label: 'Newsletter Day',
            attrs: {
              placeholder: 'Select your list subscription',
              title: 'Please select your list subscription'
            },
            items: {
              monday: { label: 'Monday' },
              tuesday: { label: 'Tuesday' },
              wednesday: { label: 'Wednesday' },
              thursday: { label: 'Thursday' },
              friday: { label: 'Friday' },
              saturday: { label: 'Saturday' },
              sunday: { label: 'Sunday' }
            }
          },
          source: {
            kind: 'textarea',
            label: 'Source',
            description: 'Ex. Using the NPM Search Engine',
            attrs: {
              placeholder: 'How did you hear about us?'
            }
          },
          password: {
            attrs: {
              type: 'password'
            }
          },
          frequence: {
            items: {
              daily: { label: 'Daily' },
              weekly: { label: 'Weekly' }
            }
          }
        }
      }
    }),
    computed: {
      parsedSchema() {
        return JSON.parse(this.rawSchema);
      },
      rawModel() {
        return JSON.stringify(this.model, null, 2);
      },
      props() {
        return {
          schema: this.schema,
          search: this.search,
          disabled: this.disabled,
          descriptor: this.enableDescriptor ? this.descriptor : {}
        };
      }
    },
    watch: {
      parsedSchema(value) {
        this.dereferenceSchema();
      }
    },
    created() {
      this.dereferenceSchema();
    },
    methods: {
      setRawSchema(value) {
        try {
          JSON.parse(value);

          this.rawSchema = value;
        } catch(e) {}
      },
      dereferenceSchema() {
        $RefParser.dereference(this.parsedSchema)
          .then((schema) => {
            this.schema = schema;
          })
          .catch((err) => console.error(err));
      },
      generateCode() {
        setTimeout(() => {
          const code = this.$refs.form.innerHTML.replace(/\s*<!---->/g, '');

          this.code = html(code, {
            indent_size: 2
          });
        }, 300);
      },
      updateRenderKey() {
        this.renderKey = UniqueId.get('code');
      }
    }
  }
</script>

<style lang="stylus">
  .playground
    text-align: left
    margin: auto
    /* display: flex */
    flex-direction: column
    color: #f5f5f5
    background-color: #333333
    overflow: hidden

    position: relative
    height: 100%

    h2
      margin: 0
      padding: 8px
      font-size: 12px
      font-weight: 400
      width: 100%

    pre
      margin: 0

    h2, &__input
      border-bottom: 1px solid rgba(255, 255, 255, .1)

    &__input
      display: flex
      flex-direction: row

      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 70%

      &__schema
        display: flex
        flex-direction: column

        &__editor
          flex: 1
          display: flex
          align-items: flex-start
          max-width: 400px
          overflow: auto

      &__schema__editor, &__model__value, &__output__code
        background-color: #2d2d2d
        flex: 1
        width: 100%

      &__rendering, &__model
        display: flex
        flex-direction: column
        align-items: flex-start
        overflow: hidden

      &__rendering
        width: 100%
        border-left: 1px solid rgba(116, 81, 81, 0.1)
        border-right: 1px solid rgba(255, 255, 255, .1)

        &__viewport
          flex: 1
          padding: 20px 0 40px
          overflow: auto
          margin: auto
          color: #333
          background-color: #f5f5f5
          font-size: .8em
          width: 100%

          &__options
            text-align: left
            padding: 0 15px 20px

            display: flex
            flex-direction: row

            label
              display: flex
              flex-direction: row
              align-items: center

              &:not(:first-child)
                margin-left: 20px

              span
                flex: 1

          &__card
            border-radius: 10px
            box-shadow: 0 0 2rem 0 rgba(136,152,170, .45)
            background-color: #fff
            padding: 20px 20px
            max-width: 400px
            margin: auto

            &__buttons
              text-align: center

              button:not(:first-child)
                margin-left: 15px

            fieldset
              border: none
              /* border-bottom: 1px solid rgba(0, 0, 0, .2) */

              padding: 10px 0
              margin-bottom: 10px

            legend
              font-size: 1.7em
              text-align: center
              margin-top: 0
              margin-bottom: .2em

      &__model
        flex: 0
        margin: 0
        min-width: 280px

        &__value
          display: flex
          overflow: auto

      &__rendering
        p
          text-align: center
          margin-top: 0

        form > fieldset
          & > legend
            font-size: 18px

          & > p
            margin-bottom: 25px

        &__viewport
          &__card
            span
              color: rgba(0, 0, 0, .6)

            input, textarea, select
              display: block

        fieldset fieldset legend
          display: block
          font-size: 14px
          text-align: left
          width: 100%
          padding: 0 0 2px
          border-bottom: 1px solid rgba(0, 0, 0, .2)

    &__output
      position: absolute
      top: 70%
      left: 0
      width: 100%
      height: 30%

      overflow: hidden
      display: flex
      flex-direction: column

      &__code
        flex: 1
        display: flex
        overflow: auto

  [data-fs-kind]
    flex: 1
    display: flex
    flex-direction: row
    margin-bottom: 5px

    & > label
      display: block
      width: 120px
      min-width: 120px
      text-align: right
      margin-right: 10px

      &:active
        outline: none

  [data-fs-kind="enum"]
    [data-fs-kind]
      flex-direction: row-reverse

      label
        text-align: left
        flex: 1

  [data-fs-input]
    flex: 1
    display: flex
    flex-direction: column
    align-items: flex-start

  [data-fs-input="array"]
    & > [data-fs-kind]
      flex-direction: column

      label
        text-align: left

    & > [data-fs-input]
      margin-bottom: 5px

      & > *
        margin-left: 0
</style>
