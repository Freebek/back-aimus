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

  @Prop({ type: String, unique: true, sparse: true })
  steam_id: string; // Steam ID (64-bit)

  @Prop({ type: String })
  steam_name: string;

  @Prop({ required: false })
  steam_avatar: string;

  @Prop({ type: Boolean, default: false })
  is_steam_linked: boolean;

  @Prop({ type: String, required: true })
  last_login_at: string;

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
