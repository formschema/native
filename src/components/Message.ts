import { MessageComponent } from '@/types';

export const MessageElement: MessageComponent = {
  functional: true,
  name: 'MessageElement',
  render(h, { props }) {
    return h('div', {
      attrs: {
        'data-fs-message': props.type
      }
    }, [
      h('span', {
        attrs: {
          'data-fs-message-text': true
        }
      }, props.text)
    ]);
  }
};
