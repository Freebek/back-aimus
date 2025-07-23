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

    const user = await this.userModel.findOne({ steam_id: steamUser.steamid });

    if (!user) {
      const steamIdNum = BigInt(steamUser.steamid);
      const Y = steamIdNum % 2n;
      const Z = (steamIdNum - 76561197960265728n - Y) / 2n;

      const user = await this.userModel.create({
        steam_id: steamUser.steamid,
        steam_id_64: steamUser.steamid,
        steam_id_32: `STEAM_1:${Y}:${Z}`,
        steam_id_3: `[U:1:${Z * 2n + Y}]`,
        profile_url: steamUser.profileurl,
        time_created: steamUser.timecreated,
        country: steamUser.loccountrycode,
        state: steamUser.locstatecode,
        city: steamUser.loccityid,
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

    const token = this.jwtService.sign({
      id: user._id,
    });

    return token;
  }
}
