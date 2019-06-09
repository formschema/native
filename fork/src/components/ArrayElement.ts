import { VNode, FunctionalComponentOptions } from 'vue';
import { ArrayInputs, ArrayButton } from '../lib/NativeElementsLib';
import { CheckboxGroup } from "./CheckboxGroup";
import { HelperElement } from "@/components/HelperElement";

export const NativeFieldset: FunctionalComponentOptions = {
  functional: true,
  render(h, { data, props, slots }) {
    const { newItemButton } = data;
    const nodes: VNode[] = [];

    if (props.field.isArrayField) {
      if (newItemButton) {
        nodes.push(h(ArrayInputs, slots().default));
        nodes.push(h(ArrayButton, newItemButton));
      } else {
        nodes.push(h(CheckboxGroup, data, slots().default));
      }
    } else {
      const children = slots().default || [];

      nodes.push(...children);
    }

    nodes.push(h(HelperElement, data));

    if (!props.field.label) {
      return nodes.length === 1 ? nodes[0] : nodes;
    }

    return h('fieldset', nodes);
  }
};
