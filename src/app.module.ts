import { Module } from '@nestjs/common';
import { RconModule } from './modules/rcon/rcon.module';

@Module({
  imports: [RconModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
