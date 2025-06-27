import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { model, ObjectId, Document } from 'mongoose';
import { DefaultStatusEnum, UserRoleEnum } from '../../types/global/constants';
import {
  DefaultStatusType,
  UserRoleType,
  UserSteamProfileType,
} from '../../types/global/types';

export type UserDocument = User & Document;

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  _id: ObjectId;

  @Prop({ type: String, required: true, maxlength: 200, minlength: 2 })
  full_name: string;

  @Prop({
    type: String,
    required: true,
    maxlength: 50,
    minlength: 3,
  })
  username: string;

  @Prop({ type: String, unique: true, sparse: true })
  email: string;

  @Prop({ type: String, required: true, maxlength: 100, minlength: 8 })
  password: string;

  @Prop({ type: String, enum: UserRoleEnum, required: true })
  role: UserRoleType;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ type: String, unique: true, sparse: true })
  steam_id: string; // Steam ID (64-bit)

  @Prop({ type: Object, required: false })
  steam_profile: UserSteamProfileType;

  @Prop({ type: Boolean, default: false })
  is_steam_linked: boolean;

  @Prop({ type: String, required: true })
  created_at: string;

  @Prop({ type: String, required: false })
  updated_at: string;
}

export const collectionName = 'USER';
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ full_name: 1 });
UserSchema.index({ index: 1 });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index(
  { phone: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { phone: { $type: 'string' } },
  },
);

export const UserModelDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
  collection: collectionName,
};
model(User.name, UserSchema, collectionName);
