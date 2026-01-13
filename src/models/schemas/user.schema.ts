import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { model, ObjectId, Document } from 'mongoose';
import { DefaultStatusEnum, UserRoleEnum } from '../../types/global/constants';
import {
  DefaultStatusType,
  UserRoleType,
  UserSteamProfileType,
} from '../../types/global/types';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: ObjectId;

  @Prop({ type: String, required: true, unique: true })
  steam_id: string;

  @Prop({ type: String })
  steam_name: string;

  @Prop({ required: false })
  steam_avatar: string;

  @Prop({ type: String, required: true, unique: true })
  steam_id_64: string;

  @Prop({ type: String, required: true, unique: true })
  steam_id_32: string;

  @Prop({ type: String, required: true, unique: true })
  steam_id_3: string;

  @Prop({ type: String, required: false })
  profile_url: string;

  @Prop({ type: String, required: false })
  time_created: string;

  @Prop({ type: String, required: false })
  country: string;

  @Prop({ type: String, required: false })
  state: string;

  @Prop({ type: String, required: false })
  city: string;

  @Prop({ type: String, required: true })
  last_login_at: string;

  @Prop({ type: Boolean, required: false, default: false })
  oferta_read: boolean;

  // @Prop({ type: String, required: true, maxlength: 200, minlength: 2 })
  // full_name: string;

  // @Prop({
  //   type: String,
  //   required: true,
  //   maxlength: 50,
  //   minlength: 3,
  // })
  // username: string;

  // @Prop({ type: String, unique: true, sparse: true })
  // email: string;

  // @Prop({ type: String, required: true, maxlength: 100, minlength: 8 })
  // password: string;

  // @Prop({ type: String, enum: UserRoleEnum, required: true })
  // role: UserRoleType;
}

export const collectionName = 'USER';
export const UserSchema = SchemaFactory.createForClass(User);

export const UserModelDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
  collection: collectionName,
};
model(User.name, UserSchema, collectionName);
