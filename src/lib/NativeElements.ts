import { Components } from '@/lib/Components';
import { InputElement } from '@/components/InputElement';
import { StateElement } from '@/components/StateElement';
import { ArrayElement } from '@/components/ArrayElement';
import { FieldsetElement } from '@/components/FieldsetElement';
import { ListElement } from '@/components/ListElement';
import { TextareaElement } from '@/components/TextareaElement';

export const NativeElements = new Components();

NativeElements.set('array', ArrayElement);
NativeElements.set('boolean', StateElement);
NativeElements.set('string', InputElement);
NativeElements.set('password', InputElement);
NativeElements.set('file', InputElement);
NativeElements.set('image', InputElement);
NativeElements.set('radio', StateElement);
NativeElements.set('checkbox', StateElement);
NativeElements.set('enum', FieldsetElement);
NativeElements.set('number', InputElement);
NativeElements.set('integer', InputElement);
NativeElements.set('object', FieldsetElement);
NativeElements.set('list', ListElement);
NativeElements.set('textarea', TextareaElement);
