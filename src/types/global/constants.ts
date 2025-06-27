export enum UserRoleEnum {
  Admin = 'admin',
  Player = 'player',
}

export enum DefaultStatusEnum {
  Active = 1,
  InActive = 0,
}

export const ErrorMessageForPassword =
  'Password too weak. Must include uppercase, lowercase, number, and special character.';

export enum PermissionMethodsEnum {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export const IS_PUBLIC_KEY = 'isPublic';

export enum LanguagesEnum {
  English = 'en',
  Uzbek = 'uz',
  Russian = 'ru',
}
