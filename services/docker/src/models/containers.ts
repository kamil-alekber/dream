import {
  prop,
  getModelForClass,
  modelOptions,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Kind } from '../docker';
@modelOptions({
  schemaOptions: {
    collection: 'container',
  },
})
class ContainersSchema {
  @prop({ required: true, unique: true })
  public containerId: string;

  @prop({ required: true })
  public userId: string;

  @prop({ required: true, type: String })
  public kind: Kind;
}

export const Containers = getModelForClass(ContainersSchema);

export type ContainerDocumentType = DocumentType<ContainersSchema>;
export type ContainerModelType = ReturnModelType<typeof ContainersSchema>;
