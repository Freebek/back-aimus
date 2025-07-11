import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-steam';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor() {
    super({
      returnURL: 'https://654222718948.ngrok-free.app/v1/auth/steam/return',
      realm: 'https://654222718948.ngrok-free.app/',
      apiKey: process.env.STEAM_API_KEY || 'D9346BB124881D8298117C90DE68C2F9',
    });
  }

  validate(identifier: string, profile: any, done: Function) {
    console.dir(profile, { depth: null }); // show full nested structure
    done(null, profile);
  }
}
