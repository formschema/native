/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/no-unresolved
import { NativeComponents } from '@formschema/native';

/**
 * VueMaterial Elements sample for FormSchema
 */
export default class VueMaterialComponents extends NativeComponents {
  static SwitchElement = SwitchElement;

  constructor() {
    super();

    this.set('boolean', CheckboxElement);
    this.set('string', InputElement);
    this.set('password', InputElement);
    this.set('file', FileElement);
    this.set('image', FileElement);
    this.set('radio', RadioElement);
    this.set('checkbox', CheckboxElement);
    this.set('number', InputElement);
    this.set('integer', InputElement);
    this.set('list', ListElement);
    this.set('textarea', TextareaElement);
    this.set('button', ButtonElement);
  }
}

function computeEvents(field, listeners, type) {
  const events = {
    ...listeners,
    [type]: [
      (value) => {
        if (!(value instanceof Array)) {
          field.setValue(value);
        }
      }
    ]
  };

  if (listeners[type]) {
    if (listeners[type] instanceof Array) {
      events[type].unshift(...listeners[type]);
    } else {
      events[type].unshift(listeners[type]);
    }
  }

  return events;
}

const Helper = {
  functional: true,
  render(h, { props: { field } }) {
    if (field.descriptor.helper) {
      return h('span', {
        attrs: field.descriptor.helperAttrs,
        staticClass: 'md-helper-text'
      }, field.descriptor.helper);
    }

    return [];
  }
};

const FieldElement = {
  name: 'FieldElement',
  functional: true,
  render(h, { data, props: { field }, children }) {
    if (field.kind === 'hidden' || field.descriptor.definition.kind === 'hidden') {
      return children;
    }

    const props = {
      mdInline: false,
      mdClearable: false,
      mdCounter: true,
      mdTogglePassword: true,
      ...field.descriptor.props
    };

    const nodes = [];

    if (field.descriptor.label) {
      nodes.push(h('label', { attrs: field.descriptor.labelAttrs }, field.descriptor.label));
    }

    nodes.push(h(Helper, data));
    nodes.push(...children);

    return h('MdField', { props }, nodes);
  }
};

const InputElement = {
  name: 'InputElement',
  functional: true,
  render(h, { props: { field }, data, listeners }) {
    if (field.descriptor.definition.kind === 'hidden') {
      return h('input', {
        attrs: {
          ...field.descriptor.attrs,
          type: 'hidden'
        }
      });
    }

    switch (field.schema.format) {
      case 'date':
      case 'date-time':
        return h('MdDatepicker', {
          attrs: field.descriptor.attrs,
          props: {
            id: field.descriptor.attrs.id,
            value: field.value,
            mdModelType: String,
            mdImmediately: true
          },
          on: computeEvents(field, listeners, 'input'),
          staticStyle: {
            zIndex: 15
          }
        }, [
          h('label', { attrs: field.descriptor.labelAttrs }, field.descriptor.label)
        ]);
    }

    return h(FieldElement, data, [
      h('MdInput', {
        attrs: field.descriptor.attrs,
        props: {
          ...field.descriptor.props,
          id: field.descriptor.attrs.id,
          type: field.descriptor.attrs.type,
          value: field.value,
          mdCounter: field.schema.maxLength
        },
        on: computeEvents(field, listeners, 'input')
      })
    ]);
  }
};

const TextareaElement = {
  name: 'TextareaElement',
  functional: true,
  render(h, { props: { field }, data, listeners }) {
    const autogrow = 'autogrow' in field.descriptor.props
      ? field.descriptor.props.autogrow
      : field.schema.contentMediaType === 'text/plain';

    return h(FieldElement, data, [
      h('MdTextarea', {
        attrs: field.descriptor.attrs,
        props: {
          id: field.descriptor.attrs.id,
          value: field.value,
          mdAutogrow: autogrow,
          mdCounter: field.schema.maxLength
        },
        on: computeEvents(field, listeners, 'input')
      })
    ]);
  }
};

const StateElement = (tag) => ({
  name: 'StateElement',
  functional: true,
  render(h, { props: { field }, listeners, children = [] }) {
    const nodeTag = field.descriptor.props.tag || tag;
    const options = {
      disabled: field.root && field.root.disabled,
      required: field.required
    };

    switch (nodeTag) {
      case 'MdRadio':
        options.model = field.parent.value;
        options.value = field.attrs.value || field.value;
        break;

      case 'MdSwitch':
        if (field.parent && field.parent.kind === 'array') {
          options.model = field.parent.value;
          options.value = field.attrs.value || field.value;
        } else {
          options.model = field.value;
        }

        return h('div', {
          key: field.key,
          staticStyle: {
            display: 'flex',
            flexDirection: 'row'
          }
        }, [
          h('div', {
            staticStyle: {
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              margin: '5px 0'
            }
          }, [
            h('label', {
              attrs: { for: field.id }
            }, field.descriptor.label),
            field.descriptor.helper ? h('span', field.descriptor.helper) : undefined
          ]),
          h(nodeTag, {
            staticClass: 'md-primary',
            staticStyle: {
              margin: 0
            },
            props: options,
            attrs: field.attrs,
            on: computeEvents(field, listeners, 'change')
          })
        ]);

      default:
        options.model = field.value;
        options.indeterminate = false;
    }

    if (field.descriptor.helper) {
      return h('div', {
        key: field.key,
        staticStyle: {
          display: 'flex',
          flexDirection: 'row'
        }
      }, [
        h(nodeTag, {
          staticClass: 'md-primary',
          props: options,
          attrs: field.attrs,
          on: computeEvents(field, listeners, 'change')
        }),
        h('div', {
          staticStyle: {
            display: 'flex',
            flexDirection: 'column'
          }
        }, [
          h('label', {
            attrs: { for: field.id },
            staticStyle: { cursor: 'pointer' }
          }, field.descriptor.label),
          h('span', field.descriptor.helper)
        ])
      ]);
    }

    return [
      h(nodeTag, {
        key: field.key,
        staticClass: 'md-primary',
        props: options,
        attrs: field.attrs,
        on: computeEvents(field, listeners, 'change')
      }, field.descriptor.label),
      ...children
    ];
  }
});

const RadioElement = StateElement('MdRadio');
const SwitchElement = StateElement('MdSwitch');
const CheckboxElement = StateElement('MdCheckbox');

const ButtonType = {
  push: 'add',
  moveUp: 'keyboard_arrow_up',
  moveDown: 'keyboard_arrow_down',
  delete: 'delete'
};

const ButtonElement = {
  name: 'ButtonElement',
  functional: true,
  render(h, { props: { button } }) {
    const children = [
      h('VxIcon', ButtonType[button.type] || button.type)
    ];

    const klass = button.type === 'push'
      ? 'md-icon-button md-raised'
      : 'md-icon-button md-dense';

    return h('MdButton', {
      staticClass: klass,
      props: {
        disabled: button.disabled
      },
      attrs: {
        title: button.tooltip
      },
      on: {
        click: () => button.trigger()
      },
      style: {
        margin: button.type === 'push'
          ? '0 0 10px'
          : '0'
      }
    }, children);
  }
};

const ListElement = {
  name: 'ListElement',
  functional: true,
  render(h, { data, props: { field }, listeners }) {
    const children = field.descriptor.options
      .filter(({ value }) => value !== '')
      .map(({ label, value, selected }) => h('MdOption', { attrs: { value, selected } }, label));

    return h(FieldElement, data, [
      h('MdSelect', {
        attrs: field.descriptor.attrs,
        props: {
          ...field.descriptor.props,
          value: field.value
        },
        on: computeEvents(field, listeners, 'md-selected')
      }, children)
    ]);
  }
};

const FileElement = {
  name: 'FileElement',
  functional: true,
  render(h, { props: { field }, data, listeners }) {
    const nodes = [];

    if (nodes.length) {
      if (field.descriptor.label) {
        nodes.unshift(h('label', {
          attrs: {
            for: field.descriptor.attrs.id
          }
        }, field.descriptor.label));
      }

      if (field.descriptor.helper) {
        nodes.push(h('p', {
          staticStyle: {
            color: 'rgba(0, 0, 0, .54)',
            fontSize: '12px'
          }
        }, field.descriptor.helper));
      }

      return h('div', {
        staticStyle: {
          marginBottom: '20px'
        }
      }, nodes);
    }

    return h(FieldElement, data, [
      h('MdFile', {
        staticClass: data.staticClass,
        attrs: field.descriptor.attrs,
        props: {
          ...field.descriptor.props,
          id: field.descriptor.attrs.id,
          value: field.value
        },
        on: computeEvents(field, listeners, 'change')
      })
    ]);
  }
};
