import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { ScalarField, IScalarDescriptor, ScalarDescriptor, ScalarKind } from '@/types';

export class ScalarUIDescriptor
  extends UIDescriptor<ScalarField, ScalarDescriptor, ScalarKind>
  implements IScalarDescriptor {}

UIDescriptor.register('string', ScalarUIDescriptor);
UIDescriptor.register('password', ScalarUIDescriptor);
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
