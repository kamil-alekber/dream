import {
    prop,
    getModelForClass,
    modelOptions,
    DocumentType,
    ReturnModelType,
  } from "@typegoose/typegoose";
  

@modelOptions({
  schemaOptions: {
    collection: "user",
  },
})
class UserSchema {
  @prop({ required: true, unique: true })
  public userId: string;

  @prop({ required: true })
  public username: string;

  @prop({ required: true })
  public hashedPassword: string;

  @prop({ required: true, unique: true })
  public email: string;
}

export const User = getModelForClass(UserSchema);

export type UserDocumentType = DocumentType<UserSchema>;
export type UserModelType = ReturnModelType<typeof UserSchema>;
