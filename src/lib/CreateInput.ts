import { VNodeData, CreateElement, VNodeChildren } from 'vue';
import { Field, ElementProps, InputEvent, IScalarDescriptor } from '@/types';

export const CreateInput = <T extends Field<any>>(
  h: CreateElement,
  tag: string,
  data: VNodeData,
  children: VNodeChildren = [],
  event: 'input' | 'change' = 'input'
) => {
  const props = data.props as ElementProps<T, IScalarDescriptor>;

  return h(tag, {
    key: props.field.key,
    attrs: props.field.attrs,
    on: {
      [event]({ target }: InputEvent) {
        props.field.setValue(target.value);
      }
    }
  }, children);
};
