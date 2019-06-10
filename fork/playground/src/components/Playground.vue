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
          <div ref="form" class="playground__input__rendering__viewport__card">
            <FormSchema v-bind="{ schema, descriptor }" v-model="model" @ready="generateCode" @submit.prevent>
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
  import FormSchema from '../../../dist/FormSchema.esm.min.js';
  import Schema from '@/schema/newsletter';

  export default {
    components: { PrismEditor, FormSchema },
    data: () => ({
      model: undefined,
      rawSchema: JSON.stringify(Schema, null, 2),
      schema: {},
      code: '',
      formatter: null,
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
            labels: {
              monday: 'Monday',
              tuesday: 'Tuesday',
              wednesday: 'Wednesday',
              thursday: 'Thursday',
              friday: 'Friday',
              saturday: 'Saturday',
              sunday: 'Sunday'
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
            labels: {
              daily: 'Daily',
              weekly: 'Weekly'
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
            console.log(schema)
          })
          .catch((err) => console.error(err));
      },
      generateCode() {
        const code = this.$refs.form.innerHTML.replace(/\s*<!---->/g, '');

        this.code = html(code, {
          indent_size: 2
        });
      }
    }
  }
</script>

<style>
  .playground {
    text-align: left;
    margin: auto;
    /* display: flex; */
    flex-direction: column;
    color: #f5f5f5;
    background-color: #333333;
    overflow: hidden;

    position: relative;
    height: 100%;
  }

  .playground h2 {
    margin: 0;
    padding: 8px;
    font-size: 12px;
    font-weight: 400;
    width: 100%;
  }

  .playground pre {
    margin: 0;
  }

  .playground__input {
    display: flex;
    flex-direction: row;

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60%;
  }

  .playground h2,
  .playground__input {
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

  .playground__input__schema {
    display: flex;
    flex-direction: column;
  }

  .playground__input__schema__editor {
    flex: 1;
    display: flex;
    align-items: flex-start;
    max-width: 400px;
    overflow: auto;
  }

  .playground__input__schema__editor,
  .playground__input__model__value,
  .playground__output__code {
    background-color: #2d2d2d;
    flex: 1;
    width: 100%;
  }

  .playground__input__rendering {
    border-left: 1px solid rgba(255, 255, 255, .1);
    border-right: 1px solid rgba(255, 255, 255, .1);
  }

  .playground__input__rendering,
  .playground__input__model {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
    width: 100%;
  }

  .playground__input__model {
    max-width: 300px;
  }

  .playground__input__rendering__viewport {
    flex: 1;
    padding: 20px;
    overflow: auto;
    margin: auto;
    color: #333;
    background-color: #f5f5f5;
    font-size: .8em;
    width: 100%;
  }

  .playground__input__rendering__viewport__card {
    border-radius: 10px;
    box-shadow: 0 0 2rem 0 rgba(136,152,170, .45);
    background-color: #fff;
    padding: 20px 20px;
    max-width: 400px;
    margin: auto;
  }

  .playground__input__rendering__viewport__card__buttons {
    text-align: center;
  }

  .playground__input__rendering__viewport__card__buttons button:not(:first-child) {
    margin-left: 15px;
  }

  .playground__input__rendering fieldset {
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, .2);

    padding: 10px 0;
    margin-bottom: 10px;
  }

  .playground__input__rendering legend {
    font-size: 1.7em;
    text-align: center;
    margin-top: 0;
    margin-bottom: .2em
  }

  .playground__input__rendering form > fieldset > legend {
    font-size: 18px;
  }

  .playground__input__rendering form > fieldset > p {
    margin-bottom: 25px;
  }

  .playground__input__rendering p {
    text-align: center;
    margin-top: 0;
  }

  .playground__input__rendering span {
    color: rgba(0, 0, 0, .6);
  }

  .playground__input__rendering fieldset fieldset legend {
    display: block;
    font-size: 14px;
    text-align: left;
    width: 100%;
    padding: 0 0 2px;
    border-bottom: 1px solid rgba(0, 0, 0, .2);
  }

  .playground__input__rendering input,
  .playground__input__rendering textarea,
  .playground__input__rendering select {
    display: block;
  }

  .playground__input__model {
    flex: 0;
    margin: 0;
    min-width: 100px;
  }

  .playground__output {
    position: absolute;
    top: 60%;
    left: 0;
    width: 100%;
    height: 40%;

    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .playground__output__code {
    flex: 1;
    display: flex;
    overflow: auto;
  }

  [data-fs-kind] {
    flex: 1;
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
  }

  [data-fs-kind] > label {
    display: block;
    width: 120px;
    min-width: 120px;
    text-align: right;
    margin-right: 10px
  }

  [data-fs-kind] > label:active {
    outline: none;
  }

  [data-fs-kind="enum"] [data-fs-kind] {
    flex-direction: row-reverse;
  }

  [data-fs-kind="enum"] [data-fs-kind] label {
    text-align: left;
    flex: 1;
  }

  [data-fs-input] {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  [data-fs-input="array"] > [data-fs-kind] {
    flex-direction: column;
  }

  [data-fs-input="array"] > [data-fs-kind] label {
    text-align: left;
  }

  [data-fs-input="array"] > [data-fs-input] {
    margin-bottom: 5px;
  }

  [data-fs-input="array"] > [data-fs-input] > * {
    margin-left: 0;
  }
</style>
