import { Module } from '@nestjs/common';
import { RconService } from './rcon.service';
import { RconController } from './rcon.controller';

@Module({
  controllers: [RconController],
  providers: [RconService],
})
export class RconModule {}
