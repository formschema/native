import { FunctionalComponentOptions } from 'vue';

export const ArrayButton: FunctionalComponentOptions = {
  functional: true,
  name: 'ArrayButton',
  render(h, { data, listeners }) {
    return h('button', {
      attrs: { type: 'button', ...data.attrs },
      on: listeners
    }, 'Add');
  }
};
