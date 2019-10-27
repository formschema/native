import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { Components } from '@/lib/Components';

import {
  ArrayField,
  IArrayDescriptor,
  ArrayDescriptor,
  ButtonDescriptor,
  ActionPushTrigger,
  DescriptorInstance,
  IArrayChildDescriptor
} from '@/types';

function parseActionButton(type: string, button: any, descriptor: any): any {
  const itemField = descriptor.field;
  const defaultButton = itemField.buttons[type] || {};

  return {
    type,
    label: button.label || defaultButton.label,
    trigger: button.trigger || defaultButton.trigger,
    get disabled() {
      return button.disabled || defaultButton.disabled || false;
    }
  };
}

const BUTTONS: any = {
  moveUp: {
    label: '↑',
    tooltip: undefined
  },
  moveDown: {
    label: '↓',
    tooltip: undefined
  },
  delete: {
    label: '-',
    tooltip: undefined
  }
};

export class ArrayUIDescriptor extends UIDescriptor<ArrayField> implements IArrayDescriptor {
  items: DescriptorInstance[] | DescriptorInstance = [];
  pushButton: ButtonDescriptor<ActionPushTrigger> = {} as any;
  buttons: any = {};

  constructor(options: ArrayDescriptor, field: Readonly<ArrayField>, components: Components) {
    super(options, field, components);

    if (options.items) {
      this.items = options.items;
    }

    this.parseButtons(options);
    this.parsePushButton();
  }

  get children(): IArrayChildDescriptor[] {
    return this.field.childrenList
      .map((field, index) => this.getDescriptor(index))
      .map((descriptor) => {
        if (!this.field.uniqueItems && this.field.sortable) {
          descriptor.buttons = Object.keys(this.buttons).map((type) => {
            return parseActionButton(type, this.buttons[type], descriptor);
          });
        }

        return descriptor;
      });
  }

  parseButtons(options: ArrayDescriptor) {
    const buttons: any = options.buttons || BUTTONS;

    for (const type in buttons) {
      if (type === 'push') {
        const label = '+';

        this.pushButton = { label, ...buttons[type], type };
      } else {
        this.buttons[type] = { ...(BUTTONS[type] || {}), ...buttons[type], type };
      }
    }
  }

  parsePushButton() {
    this.pushButton.type = 'push';

    Object.defineProperty(this.pushButton, 'disabled', {
      enumerable: true,
      get: () => this.field.pushButton.disabled
    });

    if (!this.pushButton.hasOwnProperty('label')) {
      this.pushButton.label = '+';
    }

    if (!this.pushButton.hasOwnProperty('trigger')) {
      this.pushButton.trigger = () => this.field.pushButton.trigger();
    }
  }

  getDescriptor(index: number): IArrayChildDescriptor {
    const field = this.field.children[index];
    const descriptor = this.items instanceof Array
      ? UIDescriptor.get(this.items[index] || {}, field, this.components)
      : UIDescriptor.get(this.items || {}, field, this.components);

    return descriptor === null
      ? UIDescriptor.get({ kind: 'string' }, field, this.components) as any
      : descriptor;
  }
}

UIDescriptor.register('array', ArrayUIDescriptor);
