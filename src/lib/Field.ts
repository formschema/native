import { CreateElement, VNode } from 'vue';
import { UnknowField } from '@/types';

export const Field = {
  renderMessages(h: CreateElement, field: UnknowField, nodes: VNode[], renderAtTop = false): void {
    field.messages.forEach(({ text, type = 3 }) => {
      const messageNode = h(field.descriptor.components.get('message'), {
        props: { text, type }
      }, text);

      if (renderAtTop) {
        nodes.unshift(messageNode);
      } else {
        nodes.push(messageNode);
      }
    });
  }
};
