import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { UserInterfaces } from '../interface/user-group.interface';
import { ErrorMessageForPassword } from 'src/types/global/constants';

export class UserLogInDto implements UserInterfaces.LogInRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_\(\)])/, {
    message: ErrorMessageForPassword,
  })
  @Length(8, 20)
  @IsString()
  @IsNotEmpty()
  password: string;
}
