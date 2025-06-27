import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-steam';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor() {
    super({
      returnURL: 'https://aimus.uz/',
      realm: 'https://aimus.uz/',
      apiKey: process.env.STEAM_API_KEY || 'D9346BB124881D8298117C90DE68C2F9',
    });
  }

  validate(identifier: string, profile: any, done: Function) {
    console.log(profile, 'PROFILE');
    done(null, profile);
  }
}
