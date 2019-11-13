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

function parseActionButton(type: string, button: any, itemField: any): any {
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

export class ArrayUIDescriptor extends UIDescriptor<ArrayField, ArrayDescriptor> implements IArrayDescriptor {
  items: DescriptorInstance[] | DescriptorInstance = [];
  pushButton: ButtonDescriptor<ActionPushTrigger> = {} as any;
  buttons: any = {};
  readonly children: IArrayChildDescriptor[] = [];

  constructor(options: ArrayDescriptor, field: Readonly<ArrayField>, components: Components) {
    super(options, field, components);

    if (options.items) {
      this.items = options.items;
    }
  }

  getChildren(field: ArrayField): IArrayChildDescriptor[] {
    return field.childrenList
      .map((childField, index) => ({
        childField,
        childDescriptor: this.getChildDescriptor(field, index)
      }))
      .map(({ childField, childDescriptor }) => {
        if (!field.uniqueItems && field.sortable) {
          childDescriptor.buttons = Object.keys(this.buttons).map((type) => {
            return parseActionButton(type, this.buttons[type], childField);
          });
        }

        return childDescriptor;
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

  parsePushButton(field: Readonly<ArrayField>) {
    this.pushButton.type = 'push';

    Object.defineProperty(this.pushButton, 'disabled', {
      enumerable: true,
      get: () => field.pushButton.disabled
    });

    if (!this.pushButton.hasOwnProperty('label')) {
      this.pushButton.label = '+';
    }

    if (!this.pushButton.hasOwnProperty('trigger')) {
      this.pushButton.trigger = () => field.pushButton.trigger();
    }
  }

  getChildDescriptor(field: Readonly<ArrayField>, index: number): IArrayChildDescriptor {
    const childField = field.children[index];
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

    this.parseButtons(this.definition);
    this.parsePushButton(field);

    this.children.push(...this.getChildren(field));
  }
}

UIDescriptor.register('array', ArrayUIDescriptor);
