import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateOfertaDto } from 'src/types/user/dto/update-oferta.dto';

@Controller('oferta')
export class OfertaController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateOferta(@Req() request: Request, @Body() body: UpdateOfertaDto) {
    const userId = request['user_id'];
    return this.userService.updateOfertaRead(userId, body.oferta_read);
  }
}
