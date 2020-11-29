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
  public firstName: string;

  @prop({ required: true })
  public lastName: string;

  @prop({ required: true })
  public email: string;
}

export const Users = getModelForClass(UsersSchema);

export type UserDocumentType = DocumentType<UsersSchema>;
export type UserModelType = ReturnModelType<typeof UsersSchema>;
