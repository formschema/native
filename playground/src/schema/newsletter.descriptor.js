export default {
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
    hiddenField: {
      kind: 'hidden'
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
      kind: 'password'
    },
    frequence: {
      items: {
        daily: { label: 'Daily' },
        weekly: { label: 'Weekly' }
      }
    }
  }
}
