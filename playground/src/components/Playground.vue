<template>
  <div class="playground">
    <div class="playground__top">
      <PlaygroundPanel class="playground__top__schema">
        <template v-slot:header>
          <div>Schema</div>
          <select>
            <template v-for="key in schemas">
              <option :key="key" :value="key">{{ schemas[key] }}</option>
            </template>
          </select>
        </template>
        <template v-slot:body>
          <PrismEditor :code="rawSchema" language="json" @change="setRawSchema"/>
        </template>
      </PlaygroundPanel>
      <PlaygroundPanel class="playground__top__rendering">
        <template v-slot:header>Rendering</template>
        <template v-slot:body>
          <div class="playground__top__rendering__viewport">
            <div class="playground__top__rendering__viewport__options">
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
            <div ref="form" class="playground__top__rendering__viewport__card" :key="renderKey">
              <FormSchema v-bind="props" v-model="model" @input="generateCode" @submit.prevent>
                <div class="playground__top__rendering__viewport__card__buttons">
                  <button type="submit">Submit</button>
                  <button type="reset">Reset</button>
                </div>
              </FormSchema>
            </div>
          </div>
        </template>
      </PlaygroundPanel>
      <PlaygroundPanel class="playground__top__model">
        <template v-slot:header>Model</template>
        <template v-slot:body>
          <PrismEditor :code="rawModel" language="json" readonly/>
        </template>
      </PlaygroundPanel>
    </div>
    <PlaygroundPanel class="playground__output">
      <template v-slot:header>Generated HTML</template>
      <template v-slot:body>
        <PrismEditor :code="code" language="html" readonly/>
      </template>
    </PlaygroundPanel>
  </div>
</template>

<script>
  import '@/libs/Prism';
  import '@/styles/Prism.css';

  import { html } from 'js-beautify';
  import $RefParser from 'json-schema-ref-parser';

  import PrismEditor from 'vue-prism-editor';
  import PlaygroundPanel from './PlaygroundPanel';
  import FormSchema, { UniqueId } from '../../../dist/FormSchema.esm.min.js';
  import Schema from '@/schema/newsletter';

  export default {
    components: { PlaygroundPanel, PrismEditor, FormSchema },
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
      schemas: {
        array: 'Array',
        dependencies: 'Dependencies',
        number: 'Number',
        object: 'Object'
      },
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
          date: {
            label: 'Date of birth',
            props: {
              horizontal: true
            },
            properties: {
              day: {
                label: '',
                attrs: {
                  placeholder: 'Day'
                }
              },
              month: {
                label: '',
                attrs: {
                  placeholder: 'Month'
                }
              },
              year: {
                label: '',
                attrs: {
                  placeholder: 'Year'
                }
              }
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
            helper: 'Ex. Using the NPM Search Engine',
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
          id: 'form',
          schema: this.schema,
          search: this.search,
          disabled: this.disabled,
          descriptor: this.enableDescriptor ? this.descriptor : undefined
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
            this.model = {};
            this.schema = schema;
          })
          .catch((err) => console.error(err));
      },
      generateCode() {
        setTimeout(() => {
          this.code = html(this.$refs.form.innerHTML, {
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
    background-color: #2d2d2d
    overflow: hidden

    position: relative
    height: 100%

    pre
      margin: 0

    &__top
      display: flex
      flex-direction: row

      width: 100%
      height: 70%

      border-bottom: 1px solid rgba(255, 255, 255, .1)

      &__schema
        max-width: 30%

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

              span // helper
                color: rgba(0, 0, 0, .6)

              input, textarea, select
                display: block

      &__model
        min-width: 280px
        width: 50%

    &__output
      width: 100%
      height: 30%

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
      & > option[value=""]:first-child
        color: #666

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

    & > [data-fs-input]
      margin-bottom: 5px

      & > *
        margin-left: 0
</style>
