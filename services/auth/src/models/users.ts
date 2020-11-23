import {
  prop,
  getModelForClass,
  modelOptions,
  DocumentType,
  ReturnModelType,
} from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    collection: 'user',
  },
})
class UsersSchema {
  @prop({ required: true, unique: true })
  public userId: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public surname: string;
}

export const Users = getModelForClass(UsersSchema);

export type UserDocumentType = DocumentType<UsersSchema>;
export type UserModelType = ReturnModelType<typeof UsersSchema>;
