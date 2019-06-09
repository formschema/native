import { Components } from '@/lib/Components';
import { InputElement } from '@/components/InputElement';
import { FieldsetElement } from '@/components/FieldsetElement';
import { SelectElement } from '@/components/SelectElement';
import { TextareaElement } from '@/components/TextareaElement';

export const NativeElements = new Components();

NativeElements.set('boolean', InputElement);
NativeElements.set('string', InputElement);
NativeElements.set('radio', InputElement);
NativeElements.set('enum', FieldsetElement);
NativeElements.set('number', InputElement);
NativeElements.set('integer', InputElement);
NativeElements.set('object', FieldsetElement);
NativeElements.set('list', SelectElement);
NativeElements.set('textarea', TextareaElement);
