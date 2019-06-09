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
        <div ref="form" class="playground__input__rendering__viewport">
          <FormSchema :schema="schema" :descriptor="descriptor" v-model="model" @ready="generateCode" @submit.prevent>
            <div class="buttons">
              <button type="submit">Subscribe</button>
            </div>
          </FormSchema>
        </div>
      </div>
      <div class="playground__input__model">
        <h2>Model</h2>
        <pre>{{ model }}</pre>
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
  import '../libs/Prism';
  import '../styles/Prism.css';

  import { html } from 'js-beautify';

  import PrismEditor from 'vue-prism-editor';
  import FormSchema from '../../../dist/FormSchema.esm';
  import Schema from '../schema/newsletter';

  export default {
    components: { PrismEditor, FormSchema },
    data: () => ({
      model: undefined,
      rawSchema: JSON.stringify(Schema, null, 2),
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
      schema() {
        return JSON.parse(this.rawSchema);
      }
    },
    methods: {
      setRawSchema(value) {
        try {
          JSON.parse(value);

          this.rawSchema = value;
        } catch(e) {}
      },
      generateCode() {
        const code = this.$refs.form.innerHTML;

        this.code = html(code.replace(/\s+<!---->/g, ''));
      }
    }
  }
</script>

<style>
  .playground {
    text-align: left;
    margin: auto;
    display: flex;
    flex-direction: column;
    color: #f5f5f5;
    background-color: #333333;
    overflow: hidden;
  }

  .playground h2 {
    margin: 0;
    padding: 10px;
    font-size: .90em;
    font-weight: 400;
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }

  .playground pre {
    margin: 0;
  }

  .playground__input {
    display: flex;
    flex-direction: row;
    max-height: 550px;
  }

  .playground__input__schema {
    display: flex;
    flex-direction: column;
  }

  .playground__input__schema__editor {
    flex: 1;
    display: flex;
    align-items: flex-start;
    max-width: 500px;
    overflow: auto;
  }

  .playground__input__rendering {
  }

  .playground__input__rendering,
  .playground__input__model {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
  }

  .playground__input__rendering__viewport {
    padding: 20px;
    overflow: auto;
    margin: auto;
    color: #333;
    background-color: #f5f5f5;
  }

  .playground__input__rendering legend {
    font-size: 1.7em;
    text-align: center;
    margin-top: 0;
    margin-bottom: .2em
  }

  .playground__input__rendering legend + p {
    display: block;
    text-align: center;
    margin-bottom: 1.2em
  }

  .playground__input__rendering input,
  .playground__input__rendering textarea,
  .playground__input__rendering select {
    display: block;
  }

  .playground__input__model {
    margin: 0;
  }

  .playground__output {
  }

  .playground__output__code {
    display: flex;
    max-height: 400px;
    overflow: auto;
  }

  [data-fs-field] {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
  }

  [data-fs-field] label {
    display: block;
    width: 120px;
    text-align: right;
    margin-right: 10px
  }

  [data-fs-kind="enum"] [data-fs-field] {
    flex-direction: row-reverse;
  }

  [data-fs-kind="enum"] [data-fs-field] label {
    text-align: left;
    flex: 1;
  }
</style>
