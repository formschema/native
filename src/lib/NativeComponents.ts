import { Components } from '@/lib/Components';
import { InputElement } from '@/components/InputElement';
import { StateElement } from '@/components/StateElement';
import { ArrayElement } from '@/components/ArrayElement';
import { FieldsetElement } from '@/components/FieldsetElement';
import { ListElement } from '@/components/ListElement';
import { TextareaElement } from '@/components/TextareaElement';
import { MessageElement } from '@/components/MessageElement';
import { ArrayButtonElement } from '@/components/ArrayButtonElement';

export class NativeComponents extends Components {
  constructor() {
    super();

    this.set('array', ArrayElement);
    this.set('boolean', StateElement);
    this.set('string', InputElement);
    this.set('password', InputElement);
    this.set('file', InputElement);
    this.set('image', InputElement);
    this.set('radio', StateElement);
    this.set('checkbox', StateElement);
    this.set('enum', FieldsetElement);
    this.set('number', InputElement);
    this.set('integer', InputElement);
    this.set('object', FieldsetElement);
    this.set('list', ListElement);
    this.set('textarea', TextareaElement);
    this.set('message', MessageElement);
    this.set('button', ArrayButtonElement);
  }
}
