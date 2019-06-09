<template>
  <div class="playground">
    <div class="form-model">
      <div class="schema">
        <h2>Schema</h2>
        <textarea v-model="rawSchema"/>
      </div>
      <div class="form">
        <h2>Rendering</h2>
        <div ref="form">
          <FormSchema :schema="schema" :descriptor="descriptor" v-model="model" @ready="generateCode" @submit.prevent>
            <div class="buttons">
              <button type="submit">Subscribe</button>
            </div>
          </FormSchema>
        </div>
      </div>
      <div class="model">
        <h2>Model</h2>
        <pre>{{ model }}</pre>
      </div>
    </div>
    <div class="code">
      <h2>Generated HTML</h2>
      <pre><code ref="code" class="language-html"/></pre>
    </div>
  </div>
</template>

<script>
  import htmlBeautify from 'html-beautify';
  import FormSchema from '../../../dist/FormSchema.esm';
  import Schema from '../schema/newsletter';

  export default {
    components: { FormSchema },
    data: () => ({
      model: undefined,
      rawSchema: JSON.stringify(Schema, null, 2),
      code: null,
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
      generateCode() {
        const code = htmlBeautify(this.$refs.form.innerHTML);
        const formatedCode = code.replace(/\s+<!---->/g, '')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        this.$refs.code.innerHTML = formatedCode;

        setTimeout(window.Prism.highlightAll, 200);
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
  }

  .form-model {
    display: flex;
    flex-direction: row;
  }

  .schema,
  .form,
  .model,
  .code {
    padding: 20px;
  }

  h2 {
    margin: 0;
    font-size: 1em;
  }

  .schema {
    display: flex;
    flex-direction: column;
    background-color: #c5cdd6;
  }

  .schema textarea {
    flex: 1;
    min-width: 400px;
    min-height: 300px;
  }

  .form {
    flex: 1;
    background-color: #c5cdd6;
  }

  .model {
    margin: 0;
    background-color: #eff0f1;
  }

  .code {
    background-color: #b9c4d1;
    overflow: auto;
  }

  .form > legend {
    font-size: 1.7em;
    text-align: center;
    margin-top: 0;
    margin-bottom: .2em
  }

  .form > legend + p {
    display: block;
    text-align: center;
    margin-bottom: 1.2em
  }

  small {
    line-height: 20px;
    display: block;
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

  input, textarea, select {
    display: block;
  }
</style>
