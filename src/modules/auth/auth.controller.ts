import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  steamLogin() {
    return 'ok';
  }

  @Get('steam/return')
  @UseGuards(AuthGuard('steam'))
  async steamCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.validateOrCreateSteamUser(req.user);

    console.log(token, 'TOKEN');

    return res.redirect(`https://aimus.uz/`);
  }
}
