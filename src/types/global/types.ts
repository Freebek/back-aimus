import { Request } from 'express';
import {
  DefaultStatusEnum,
  LanguagesEnum,
  PermissionMethodsEnum,
  UserRoleEnum,
} from './constants';

export type UserRoleType = UserRoleEnum.Admin | UserRoleEnum.Player;

export type DefaultStatusType =
  | DefaultStatusEnum.Active
  | DefaultStatusEnum.InActive;

export type PermissionMethodsType =
  | PermissionMethodsEnum.GET
  | PermissionMethodsEnum.POST
  | PermissionMethodsEnum.PUT
  | PermissionMethodsEnum.PATCH
  | PermissionMethodsEnum.DELETE;

export type OrganizationLimitsType = {
  executors?: number;
  operators?: number;
  o_managers?: number;
};

export interface ApiResponseType<T> {
  status: number;
  result: T | null;
  error: ApiErrorType | null;
}

export interface ApiErrorType {
  message: string;
  details?: any;
}

export interface RequestWithUser extends Request {
  user: {
    user_id: string;
    [key: string]: any;
  };
  organizationId: string;
}

export type UserFromToken = {
  _id: string;
  role: UserRoleType;
};

export type LanguagesType =
  | LanguagesEnum.English
  | LanguagesEnum.Uzbek
  | LanguagesEnum.Russian;

export type DescriptionType = Record<string, string>;

export type StoreSocialNetworksType = {
  facebook?: string;
  instagram?: string;
  telegram?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
};

export interface DayWorkTimeType {
  open: boolean; // true = open, false = weekend/closed
  startTime?: string; // format: "09:00"
  endTime?: string; // format: "18:00"
}

export type UserSteamProfileType = {
  personal_name: String;
  avatar: String;
  profile_url: String;
};
