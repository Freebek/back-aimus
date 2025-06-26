import { Request } from 'express';
import {
  DayOfWeekEnum,
  DefaultStatusEnum,
  FilterTypeEnum,
  FormComponentsEnum,
  LanguagesEnum,
  OperationTypeEnum,
  PermissionMethodsEnum,
  StatusWithAchiveEnum,
  UserRoleEnum,
} from './constants';

export type UserRoleType =
  | UserRoleEnum.Admin
  | UserRoleEnum.Seller
  | UserRoleEnum.Customer;

export type DefaultStatusType =
  | DefaultStatusEnum.Active
  | DefaultStatusEnum.InActive;

export type StatusWithAchiveType =
  | StatusWithAchiveEnum.Active
  | StatusWithAchiveEnum.Archive
  | StatusWithAchiveEnum.InActive;

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

export type FilterType = FilterTypeEnum;

export type FormComponentsType = FormComponentsEnum;

export type OperationTypeType =
  | OperationTypeEnum.Ecommerce
  | OperationTypeEnum.Booking
  | OperationTypeEnum.Service;

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

export type DayOfWeekType =
  | DayOfWeekEnum.Monday
  | DayOfWeekEnum.Tuesday
  | DayOfWeekEnum.Wednesday
  | DayOfWeekEnum.Thursday
  | DayOfWeekEnum.Friday
  | DayOfWeekEnum.Saturday
  | DayOfWeekEnum.Sunday;

export interface DayWorkTimeType {
  open: boolean; // true = open, false = weekend/closed
  startTime?: string; // format: "09:00"
  endTime?: string; // format: "18:00"
}

export type StoreWorkTimeType = Record<DayOfWeekType, DayWorkTimeType>;
