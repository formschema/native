import { Dict, Component, ComponentsType, IComponents } from '../../types';

export class Components implements IComponents {
  readonly $: Dict<Component>;

  constructor () {
    this.$ = {
      form: 'form',
      message: 'div',
      default: 'input'
    };
  }

  set(kind: ComponentsType, component: Component): void {
    this.$[kind] = component;
  }

  get(kind: ComponentsType, fallbackComponent = this.$.default): Component {
    return this.$[kind] || fallbackComponent;
  }
}
