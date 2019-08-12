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
  const key = props.field.key;
  const attrs = props.descriptor.attrs;
  const on = {
    [event]({ target }: InputEvent) {
      props.field.setValue(target.value);
    }
  };

  return h(tag, { key, attrs, on }, children);
};
