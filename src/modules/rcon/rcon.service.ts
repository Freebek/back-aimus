import { Injectable } from '@nestjs/common';
import { Rcon } from 'rcon-client';
import { cs2Servers } from './server-list';

const RCON_PASSWORD = '12345678';

@Injectable()
export class RconService {
  async getAllServersInfo(): Promise<any[]> {
    const results = await Promise.allSettled(
      cs2Servers.map(async ({ host, port }) => {
        try {
          const rcon = await Rcon.connect({
            host,
            port,
            password: RCON_PASSWORD,
          });
          const statusOutput = await rcon.send('status');
          const maxPlayers = await rcon.send('sv_maxplayers');
          await rcon.end();

          return {
            host,
            port,
            ...this.parseStatus(statusOutput, Number(maxPlayers)),
          };
        } catch (error) {
          return {
            host,
            port,
            error: error.message,
          };
        }
      }),
    );

    return results
      .filter((r) => r.status === 'fulfilled')
      .map((r: any) => r.value);
  }

  private parseStatus(status: string, maxPlayers: number) {
    const hostnameMatch = status.match(/hostname:\s(.+)/i);
    const mapMatch = status.match(/map\s+:\s+([^\s]+)/i);
    const playerLines = status
      .split('\n')
      .filter((line) => line.trim().startsWith('#') && line.includes('"'));

    const players = playerLines
      .map((line) => {
        const match = line.match(/"(.+?)"/);
        return match?.[1] || null;
      })
      .filter(Boolean);

    return {
      hostname: hostnameMatch?.[1]?.trim() || null,
      map: mapMatch?.[1]?.trim() || null,
      players,
      maxPlayers,
      playersPercentage: Math.round((players.length / maxPlayers) * 100),
    };
  }
}
