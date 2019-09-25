import { Dict, Component, ComponentsType, ComponentsDeclaration } from '@/types';

export class Components implements ComponentsDeclaration {
  readonly $: Dict<Component>;

  constructor () {
    this.$ = {
      form: 'form',
      message: 'div',
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
