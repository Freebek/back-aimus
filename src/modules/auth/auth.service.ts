import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import getCurrentTimeHelper from 'src/common/helpers/get-current-time.helper';
import { User, UserDocument } from 'src/models/schemas/user.schema';
import { UserRoleEnum } from 'src/types/global';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateOrCreateSteamUser(profile: any): Promise<string> {
    const steamUser = profile._json;

    const user = await this.userModel.create({
      steam_id: steamUser.steamid,
      steam_name: steamUser.personaname,
      steam_avatar: steamUser.avatarfull,
      is_steam_linked: true,
      last_login_at: getCurrentTimeHelper(),
    });

    const token = this.jwtService.sign({
      id: user._id,
    });

    return token;
  }
}
