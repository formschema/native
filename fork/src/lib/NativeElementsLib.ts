import { VNodeData, CreateElement, FunctionalComponentOptions, } from 'vue';

import { Dictionary } from '@/types';
import { HelperElement } from '@/components/HelperElement';

interface InputEvent extends Event {
  readonly target: any;
}

export const CreateInput = (h: CreateElement, tag: string, data: VNodeData, children: any) => {
  const listeners = data.on as { [key: string]: Function };
  const on = {
    // input: (event: InputEvent | string) => listeners.input({
    //   field: data.field,
    //   value: event instanceof Event ? event.target.value : event
    // }),
    // change: (event: InputEvent | string) => listeners.change({
    //   field: data.field,
    //   value: event instanceof Event ? event.target.value : event
    // })
  };

  return h(tag, { ...data, on }, children);
};

export const CreateStateInput = (tag: string) => ({
  functional: true,
  render(h, { data, props }) {
    const { attrs }: Dictionary = data;
    const listeners = data.on as { [key: string]: Function };
    const on = {
      // change: (value: boolean | null) => listeners.change({
      //   field: data.field,
      //   value: !!value
      // })
    };

    attrs.value = attrs.value || attrs.checked === true;
    props.value = attrs.checked !== true;

    const nodes = [
      h('div', props.field.label),
      h(HelperElement, data)
    ].filter(({ tag }) => tag);

    return h(tag, { ...data, on }, nodes);
  }
}) as FunctionalComponentOptions;

export const ArrayInputs: FunctionalComponentOptions = {
  functional: true,
  render(h, { slots }) {
    return h('div', {
      attrs: {
        'data-fs-array-inputs': true
      }
    }, slots().default);
  }
};

export const ArrayButton: FunctionalComponentOptions = {
  functional: true,
  render(h, { data }) {
    return h('button', {
      attrs: { type: 'button', ...data.props },
      on: data.on
    }, 'Add');
  }
};
