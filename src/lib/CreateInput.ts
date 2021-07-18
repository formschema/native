import { VNodeData, VNodeChildren, VNode } from 'vue';
import { CreateElement, Field, ElementProps, InputEvent } from '../../types';

export const CreateInput = <T extends Field<any>>(
  h: CreateElement,
  tag: string,
  data: VNodeData,
  children: VNodeChildren | number = [],
  event: 'input' | 'change' = 'input'
): VNode => {
  const props = data.props as ElementProps<T>;

  return h(tag, {
    key: props.field.key,
    attrs: props.field.descriptor.attrs,
    on: {
      [event]({ target }: InputEvent) {
        props.field.setValue(target.value);
      }
    }
  }, children as any);
};
