import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SteamStrategy } from './steam.strategy';
import { UserModelDefinition } from 'src/models/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([UserModelDefinition]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, SteamStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
