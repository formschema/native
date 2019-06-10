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
  render(h, { data, props }) {
    const attrs = props.field.attrs.input;
    const limit = props.field.count < props.field.max
      ? props.field.count
      : props.field.maxItems || props.field.items.length;

    const nodes = Array(...Array(limit)).map((x, i) => {
      const field = props.field.definedAsObject
        ? props.field.items[0]
        : props.field.items[i];

      return renderField(h, field, props);
    });

    if (limit < props.field.count) {
      props.field.additionalItems.forEach((field) =>  {
        nodes.push(renderField(h, field, props));
      });
    }

    nodes.push(h(ArrayButton, data));

    return h(FieldElement, { attrs, props }, nodes);
  }
};
