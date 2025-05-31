import { Controller, Get } from '@nestjs/common';
import { RconService } from './rcon.service';

@Controller('cs2')
export class RconController {
  constructor(private readonly rconService: RconService) {}

  @Get('servers')
  async getServers() {
    return await this.rconService.getAllServersInfo();
  }
}
