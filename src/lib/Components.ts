import { Dictionary, Component, ComponentsType, ComponentsDeclaration } from '@/types';

export class Components implements ComponentsDeclaration {
  public readonly $: Dictionary<Component>;

  public constructor () {
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

  public set(kind: ComponentsType, component: Component) {
    this.$[kind] = component;
  }

  public get(kind: ComponentsType) {
    return this.$[kind] || this.$.default;
  }
}
