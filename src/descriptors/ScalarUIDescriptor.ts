import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { UnknowField, IScalarDescriptor } from '@/types';

export class ScalarUIDescriptor extends UIDescriptor<UnknowField> implements IScalarDescriptor {
}

UIDescriptor.register('string', ScalarUIDescriptor);
UIDescriptor.register('number', ScalarUIDescriptor);
UIDescriptor.register('integer', ScalarUIDescriptor);
UIDescriptor.register('boolean', ScalarUIDescriptor);
UIDescriptor.register('null', ScalarUIDescriptor);
UIDescriptor.register('hidden', ScalarUIDescriptor);
UIDescriptor.register('textarea', ScalarUIDescriptor);
UIDescriptor.register('image', ScalarUIDescriptor);
UIDescriptor.register('file', ScalarUIDescriptor);
UIDescriptor.register('radio', ScalarUIDescriptor);
UIDescriptor.register('checkbox', ScalarUIDescriptor);
