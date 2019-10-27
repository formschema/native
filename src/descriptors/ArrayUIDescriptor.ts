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

export class ArrayUIDescriptor extends UIDescriptor<ArrayField> implements IArrayDescriptor {
  items: DescriptorInstance[] | DescriptorInstance = [];
  pushButton: ButtonDescriptor<ActionPushTrigger> = {} as any;
  buttons: any = {
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
          const buttons = this.buttons as any;

          descriptor.buttons = Object.keys(buttons).map((type) => {
            const dynamicField = descriptor.field as any;
            const fieldButtons = descriptor.field.buttons as any;
            const fieldButton = fieldButtons[type] || {};
            const button = { ...buttons[type], ...fieldButton };

            if (!button.hasOwnProperty('trigger')) {
              button.trigger = typeof dynamicField[type] === 'function'
                ? () => dynamicField[type]()
                : () => {};
            }

            return button;
          });
        }

        return descriptor;
      });
  }

  parseButtons(options: ArrayDescriptor) {
    if (options.buttons) {
      const buttons: any = options.buttons;

      for (const type in buttons) {
        if (type === 'push') {
          this.pushButton = { ...buttons[type] };
        } else {
          this.buttons[type] = { ...buttons[type] };
          this.buttons[type].type = type;
        }
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
