import { FunctionalComponentOptions } from 'vue';
import { FieldElement } from './FieldElement';
import { ArrayButton } from './ArrayButton';

function renderField(h, field, props) {
  return h(field.component, {
    attrs: field.attrs.input,
    props: {
      ...props,
      field: field,
      value: field.model
    }
  });
}

export const ArrayElement: FunctionalComponentOptions = {
  name: 'ArrayElement',
  functional: true,
  render(h, { props }) {
    const attrs = props.field.attrs.input;
    const nodesx = props.field.items.map((field) => {
      return h(field.component, {
        attrs: field.attrs.input,
        props: {
          ...props,
          field: field,
          value: field.model
        }
      });
    });

    const max = props.field.maxItems
      ? props.field.maxItems + props.field.additionalItems.length
      : -1;

    const limit = max === -1
      ? props.field.count
      : props.field.count < props.field.maxItems
        ? props.field.count
        : props.field.maxItems;

    const nodes = Array(...Array(limit)).map((x, i) => {
      const field = props.field.items[0];

      return renderField(h, field, props);
    });

    if (limit < props.field.count) {
      props.field.additionalItems.forEach((field) =>  {
        nodes.push(renderField(h, field, props));
      });
    }

    const addButtonElement = h(ArrayButton, {
      attrs: {
        disabled: props.field.count === max
      },
      props: props,
      on: {
        click() {
          props.field.count++;
        }
      }
    });

    nodes.push(addButtonElement);

    return h(FieldElement, { attrs, props }, nodes);
  }
};
