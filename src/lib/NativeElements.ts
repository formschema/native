import { Components } from '@/lib/Components';
import { InputElement } from '@/components/InputElement';
import { CheckboxElement } from '@/components/CheckboxElement';
import { ArrayElement } from '@/components/ArrayElement';
import { FieldsetElement } from '@/components/FieldsetElement';
import { ListElement } from '@/components/ListElement';
import { TextareaElement } from '@/components/TextareaElement';
import { BooleanElement } from '@/components/BooleanElement';

export const NativeElements = new Components();

NativeElements.set('array', ArrayElement);
NativeElements.set('boolean', BooleanElement);
NativeElements.set('string', InputElement);
NativeElements.set('radio', InputElement);
NativeElements.set('checkbox', CheckboxElement);
NativeElements.set('enum', FieldsetElement);
NativeElements.set('number', InputElement);
NativeElements.set('integer', InputElement);
NativeElements.set('object', FieldsetElement);
NativeElements.set('list', ListElement);
NativeElements.set('textarea', TextareaElement);
