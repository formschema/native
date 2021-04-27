export default {
  label: 'Customers List',
  helper: 'Describe your relations',
  properties: {
    contacts: {
      items: {
        properties: {
          name: {
            label: 'Customer Name',
            attrs: {
              placeholder: 'Type a name'
            }
          },
          // since schema.contacts.items is not an array,
          // descriptor.contacts.items must be a Descriptor
          // instead of an array of descriptors
          kind: {
            kind: 'list',
            label: 'Type Customer',
            // since the native <select/> element don't support the
            // `placeholder` attribute, the component ListElement
            // has been implemented to support the `descriptor.props.placeholder`
            // property to define an input's placeholder
            props: {
              placeholder: 'Select a customer type'
            },
            items: {
              standard: { label: 'Standard' },
              invoice: { label: 'Factur' },
              purchase: { label: 'Inkop' },
              person: { label: 'Contact persoon' }
            }
          }
        }
      }
    }
  }
};
