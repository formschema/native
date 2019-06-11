import { CreateElement } from 'vue';
import { FieldsetElement } from '@/components/FieldsetElement';
import { ArrayButton } from '@/components/ArrayButton';
import { ElementProps, ArrayItemField, ArrayField, ArrayComponent } from '@/types';

function renderField(h: CreateElement, field: ArrayItemField, props: ElementProps<ArrayField>) {
  return h(field.component, {
    attrs: {
      ...field.attrs.input,
      value: field.model
    },
    props: {
      ...props,
      field: field,
      value: field.model
    }
  });
}

export const ArrayElement: ArrayComponent = {
  name: 'ArrayElement',
  functional: true,
  render(h, { data, props }) {
    const limit = props.field.count < props.field.max || props.field.max === -1
      ? props.field.count
      : props.field.maxItems || props.field.items.length;

    const nodes = Array(...Array(limit)).map((x, i) => {
      const field = props.field.definedAsObject
        ? props.field.items[0]
        : props.field.items[i];

      const model = props.field.model[i] || field.default;

      return renderField(h, { ...field, model }, props);
    });

    if (limit < props.field.count) {
      props.field.additionalItems.forEach((field) => {
        nodes.push(renderField(h, field, props));
      });
    }

    nodes.push(h(ArrayButton, data));

    return h(FieldsetElement, data, nodes);
  }
};
