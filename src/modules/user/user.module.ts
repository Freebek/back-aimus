import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OfertaController } from './oferta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModelDefinition } from 'src/models/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([UserModelDefinition]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
  ],
  controllers: [UserController, OfertaController],
  providers: [UserService],
})
export class UserModule {}
