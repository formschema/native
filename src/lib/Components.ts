import { Dictionary, Component, ComponentsType, ComponentsDeclaration } from '@/types';

export class Components implements ComponentsDeclaration {
  readonly $: Dictionary<Component>;

  constructor () {
    this.$ = {
      form: 'form',
      field: 'div',
      default: 'input'
    };
  }

  set(kind: ComponentsType, component: Component) {
    this.$[kind] = component;
  }

  get(kind: ComponentsType) {
    return this.$[kind] || this.$.default;
  }
}
