import { Injectable } from '@nestjs/common';
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
  ) {}

  async validateOrCreateSteamUser(profile: any): Promise<string> {
    const steamId = profile.id;

    const user = await this.userModel.create({
      full_name: 'Imron Shoimov',
      username: 'codex',
      password: 'imron123',
      role: UserRoleEnum.Player,
      steam_id: steamId,
      created_at: getCurrentTimeHelper(),
    });

    console.log(user, 'USER ID');

    console.log(profile, 'Profile');

    return 'ok';
  }
}
