import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  private logger = new Logger(UserService.name);

  constructor(private readonly userService: UserService) {}

  @Get('data')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getData(@Req() request: Request) {
    const userId = request['user_id'];
    return this.userService.getById(userId);
  }
}
