import { VNodeData, CreateElement, VNodeChildren } from 'vue';
import { Field, ElementProps, InputEvent } from '@/types';

export const CreateInput = <T extends Field<any>>(
  h: CreateElement,
  tag: string,
  data: VNodeData,
  children: VNodeChildren = []
) => {
  const props = data.props as ElementProps<T>;
  const on = {
    input({ target }: InputEvent) {
      props.field.set(target.value);
    }
  };

  return h(tag, { ...data, on }, children);
};
