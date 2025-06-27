import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor() {}

  async validateOrCreateSteamUser(profile: any): Promise<string> {
    const steamId = profile.id;
    console.log(steamId, 'STEAM ID');

    console.log(profile, 'Profile');

    return 'ok';
  }
}
