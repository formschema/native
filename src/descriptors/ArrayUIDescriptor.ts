import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { Components } from '@/lib/Components';

import {
  ArrayField,
  IArrayDescriptor,
  ArrayDescriptor,
  DescriptorInstance,
  IArrayChildDescriptor,
  Component,
  PushButtonDescriptor,
  ArrayItemButton,
  ArrayItemField
} from '@/types';

function parseActionButton(itemField: ArrayItemField, buttons: ArrayItemButton[]): any {
  return buttons.map((button) => {
    const defaultButton = (itemField.buttons as any)[button.type] || {};

    return {
      type: button.type,
      label: button.label || defaultButton.label,
      trigger: button.trigger || defaultButton.trigger,
      tooltip: button.tooltip || defaultButton.tooltip,
      component: button.component || defaultButton.component,
      get disabled() {
        return button.disabled || defaultButton.disabled || false;
      }
    };
  });
}

const BUTTONS: Record<string, ArrayItemButton> = {
  moveUp: {
    type: 'moveUp',
    label: '↑',
    tooltip: undefined
  },
  moveDown: {
    type: 'moveDown',
    label: '↓',
    tooltip: undefined
  },
  delete: {
    type: 'delete',
    label: '-',
    tooltip: undefined
  }
};

export class ArrayUIDescriptor extends UIDescriptor<ArrayField, ArrayDescriptor> implements IArrayDescriptor {
  readonly layout: Component;
  readonly items: DescriptorInstance[] | DescriptorInstance = [];
  readonly pushButton: PushButtonDescriptor = { type: 'push', label: '+' } as any;
  readonly buttons: ArrayItemButton[] = [];
  readonly children: IArrayChildDescriptor[] = [];

  constructor(definition: ArrayDescriptor, field: Readonly<ArrayField>, components: Components) {
    super(definition, field, components);

    this.layout = definition.layout || 'fieldset';

    if (definition.items) {
      this.items = definition.items;
    }
  }

  getChildren(field: ArrayField): IArrayChildDescriptor[] {
    return field.children
      .map((childField, index) => ({
        childField,
        childDescriptor: this.getChildDescriptor(field, index)
      }))
      .map(({ childField, childDescriptor }) => {
        if (!field.uniqueItems && field.sortable) {
          childDescriptor.buttons = parseActionButton(childField, childField.descriptor.buttons || this.buttons);
        }

        return childDescriptor;
      });
  }

  parseButtons() {
    const buttons = this.definition.buttons || Object.values(BUTTONS);

    for (const button of buttons) {
      this.buttons.push({ ...(BUTTONS[button.type] || {}), ...button });
    }
  }

  parsePushButton(field: Readonly<ArrayField>) {
    if (this.definition.pushButton) {
      Object.assign(this.pushButton, this.definition.pushButton);
    }

    Object.defineProperty(this.pushButton, 'disabled', {
      enumerable: true,
      get: () => field.pushButton.disabled
    });

    if (!this.pushButton.hasOwnProperty('trigger')) {
      this.pushButton.trigger = () => field.pushButton.trigger();
    }
  }

  getChildDescriptor(field: Readonly<ArrayField>, index: number): IArrayChildDescriptor {
    const childField = field.fields[index];
    const options = this.items instanceof Array
      ? this.items[index] || {}
      : this.items || {};

    if (this.definition.kind === 'hidden') {
      options.kind = this.definition.kind;
    }

    const descriptor = UIDescriptor.get(options, childField, this.components);

    return descriptor === null
      ? UIDescriptor.get({ kind: 'string' }, childField, this.components) as any
      : descriptor;
  }

  parse(field: ArrayField) {
    super.parse(field);

    this.parseButtons();
    this.parsePushButton(field);
    this.update(field);
  }

  update(field: ArrayField) {
    this.children.splice(0);
    this.children.push(...this.getChildren(field));
  }
}

UIDescriptor.register('array', ArrayUIDescriptor);
