import { StoreDocument } from 'src/models/schemas/store.schema';
import { UserDocument } from 'src/models/schemas/user.schema';
import { DefaultStatusEnum, UserRoleEnum } from 'src/types/global';

export namespace UserInterfaces {
  export interface LogInRequest {
    phone_number: string;
    password: string;
  }

  export interface LogInResponse {
    access_token: string;
    permissions?: any;
    user: any;
    stores: any;
  }

  // export interface CreateUserDto {
  //   full_name: string;
  //   username: string;
  //   password: string;
  //   role: UserRoleEnum;
  //   phone?: string;
  //   organization_ids?: string[];
  // }

  // export interface CreateUserWithFileDto extends CreateUserDto {
  //   avatar?: Express.Multer.File;
  // }

  // export interface CreateUserRequestDto extends Omit<CreateUserDto, 'avatar'> {
  //   avatar?: Express.Multer.File;
  // }

  // export interface UpdateUserDto {
  //   full_name?: string;
  //   username?: string;
  //   password?: string;
  //   role?: UserRoleEnum;
  //   status?: DefaultStatusEnum;
  //   phone?: string;
  // }

  // export interface UpdateUserWithFileDto extends UpdateUserDto {
  //   avatar?: Express.Multer.File;
  // }

  // export interface UserQuery {
  //   full_name?: string;
  //   username?: string;
  //   role?: UserRoleEnum;
  //   phone?: string;
  //   page?: number;
  //   limit?: number;
  // }

  // export interface UserGetMeResponse extends UserDocument {
  //   organization_name?: string;
  //   worked_applications?: any[];
  // }

  // export interface UsersResponse {
  //   total_docs: number;
  //   total_page: number;
  //   current_page: number;
  //   data: UserDocument[];
  // }
  // export interface ChangePasswordDto {
  //   current_password: string;
  //   new_password: string;
  //   confirm_password: string;
  // }
}
