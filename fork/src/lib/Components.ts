import { Dictionary, FieldKind, Component } from '@/types';

export type ComponentsType = 'form' | FieldKind;

export class Components {
  $: Dictionary<Component>;

  constructor () {
    this.$ = {
      form: 'form',
      boolean: 'input',
      integer: 'input',
      null: 'input',
      number: 'input',
      string: 'input',
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
