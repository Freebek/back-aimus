import { Controller, Get } from '@nestjs/common';
import { RconService } from './rcon.service';
import { ServerInfo } from './rcon.service';

@Controller('cs2')
export class RconController {
  constructor(private readonly rconService: RconService) {}

  @Get('servers')
  async getServers(): Promise<ServerInfo[]> {
    return await this.rconService.getAllServersInfo();
  }
}
