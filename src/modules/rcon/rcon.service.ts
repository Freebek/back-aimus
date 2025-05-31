import { Injectable } from '@nestjs/common';
import { Rcon } from 'rcon-client';
import { cs2Servers } from './server-list';

const RCON_PASSWORD = '12345678';

// Map images mapping - you can replace these URLs with your own hosted images
const MAP_IMAGES: { [key: string]: string } = {
  de_mirage: '/maps/de_mirage.jpg',
  de_inferno: '/maps/de_inferno.jpg',
  de_dust2: '/maps/de_dust2.jpg',
  de_nuke: '/maps/de_nuke.jpg',
  de_overpass: '/maps/de_overpass.jpg',
  de_ancient: '/maps/de_ancient.jpg',
  de_anubis: '/maps/de_anubis.jpg',
  de_vertigo: '/maps/de_vertigo.jpg',
};

interface PlayerInfo {
  userId: number;
  playerName: string;
  avatar?: string;
  steam64?: string;
  score: number;
  admin: null;
  kills: string;
  deaths: string;
}

export interface ServerInfo {
  id?: number;
  hostname: string | null;
  address: string;
  map: string | null;
  mapImage?: string | null;
  players: PlayerInfo[];
  maxPlayers: number | null;
  playersPercentage: number;
  vac: null;
  game: string;
  chat: {
    messages: string[];
  };
  serverIp: string;
}

@Injectable()
export class RconService {
  async getAllServersInfo(): Promise<ServerInfo[]> {
    const results = await Promise.allSettled(
      cs2Servers.map(async ({ host, port }, index) => {
        try {
          const rcon = await Rcon.connect({
            host,
            port,
            password: RCON_PASSWORD,
          });

          const statusOutput = await rcon.send('status');
          console.log(statusOutput, 'Status Output');

          // Get player stats
          const statsOutput = await rcon.send('stats');
          console.log('Stats Output:', statsOutput);

          // Try multiple commands to get max players
          let maxPlayers: number | null = null;

          // First try from status output
          const maxPlayersMatch = statusOutput.match(
            /players\s*:\s*\d+\s*humans,\s*\d+\s*bots\s*\((\d+)\s*max\)/i,
          );
          if (maxPlayersMatch) {
            const parsed = parseInt(maxPlayersMatch[1]);
            if (!isNaN(parsed) && parsed > 0) {
              maxPlayers = parsed;
            }
          }

          // If not found in status, try game server settings
          if (!maxPlayers) {
            try {
              const maxPlayersResponse = await rcon.send('sv_maxplayers');
              console.log('sv_maxplayers response:', maxPlayersResponse);
              const cleaned = maxPlayersResponse.replace(/[^0-9]/g, '');
              const parsed = parseInt(cleaned);
              if (!isNaN(parsed) && parsed > 0) {
                maxPlayers = parsed;
              }
            } catch (error) {
              console.log('Failed to get sv_maxplayers:', error);
            }
          }

          // If still not found, try mp_maxplayers
          if (!maxPlayers) {
            try {
              const mpMaxPlayersResponse = await rcon.send('mp_maxplayers');
              console.log('mp_maxplayers response:', mpMaxPlayersResponse);
              const cleaned = mpMaxPlayersResponse.replace(/[^0-9]/g, '');
              const parsed = parseInt(cleaned);
              if (!isNaN(parsed) && parsed > 0) {
                maxPlayers = parsed;
              }
            } catch (error) {
              console.log('Failed to get mp_maxplayers:', error);
            }
          }

          // If all else fails, try to get it from server config
          if (!maxPlayers) {
            try {
              const configResponse = await rcon.send('sv_maxclients');
              console.log('sv_maxclients response:', configResponse);
              const cleaned = configResponse.replace(/[^0-9]/g, '');
              const parsed = parseInt(cleaned);
              if (!isNaN(parsed) && parsed > 0) {
                maxPlayers = parsed;
              }
            } catch (error) {
              console.log('Failed to get sv_maxclients:', error);
            }
          }

          // If we still don't have maxPlayers, check if it's a competitive server
          if (!maxPlayers) {
            const isCompetitive =
              statusOutput.toLowerCase().includes('competitive') ||
              statusOutput.toLowerCase().includes('5v5') ||
              statusOutput.toLowerCase().includes('mix');
            maxPlayers = isCompetitive ? 10 : 12; // Default to 10 for competitive, 12 for others
          }

          console.log('Final maxPlayers value:', maxPlayers);
          await rcon.end();

          const serverInfo = this.parseStatus(
            statusOutput,
            maxPlayers,
            statsOutput,
          );
          return {
            id: index + 1,
            address: `${host}:${port}`,
            serverIp: host,
            game: 'Counter-Strike 2',
            vac: null,
            chat: {
              messages: [],
            },
            ...serverInfo,
          };
        } catch (error) {
          console.error(`Error connecting to server ${host}:${port}:`, error);
          return {
            id: index + 1,
            hostname: null,
            address: `${host}:${port}`,
            map: null,
            mapImage: null,
            players: [],
            maxPlayers: 10, // Default to 10 for error cases
            playersPercentage: 0,
            vac: null,
            game: 'Counter-Strike 2',
            chat: {
              messages: [],
            },
            serverIp: host,
            error: error.message,
          };
        }
      }),
    );

    return results
      .filter((r) => r.status === 'fulfilled')
      .map((r: any) => r.value);
  }

  private parseStatus(
    status: string,
    maxPlayers: number | null,
    statsOutput: string,
  ): Partial<ServerInfo> {
    // Parse hostname
    const hostnameMatch = status.match(/hostname\s*:\s*(.+?)(?:\n|$)/i);

    // Parse map - it's in the spawngroup section
    const mapMatch = status.match(
      /loaded spawngroup\(\s*1\)\s*:\s*SV:\s*\[\d+:\s*([^|\n]+)/i,
    );
    const map = mapMatch?.[1]?.trim() || null;

    // Parse players section
    const playersSection = status.split('---------players--------')[1];
    const players: PlayerInfo[] = [];

    // Parse stats for all players
    const playerStats: {
      [name: string]: { kills: string; deaths: string; score: number };
    } = {};

    console.log(statsOutput, 'Stats Output');

    if (statsOutput) {
      const statsLines = statsOutput.split('\n');
      statsLines.forEach((line) => {
        // Example format: "Name Kills Deaths Score"
        const statsMatch = line.match(/^"(.+)"\s+(\d+)\s+(\d+)\s+(\d+)/);
        if (statsMatch) {
          const [, name, kills, deaths, score] = statsMatch;
          playerStats[name] = {
            kills,
            deaths,
            score: parseInt(score),
          };
        }
      });
    }

    if (playersSection) {
      const playerLines = playersSection.split('\n');
      playerLines.forEach((line) => {
        // Match player info: id, time, ping, loss, state, rate, address, name
        const playerMatch = line.match(
          /^\s*(\d+)\s+[\d:]+\s+\d+\s+\d+\s+\w+\s+\d+\s+[\d.:]+\s+'([^']+)'$/,
        );
        if (playerMatch && !line.includes('challenging')) {
          const userId = parseInt(playerMatch[1]);
          const playerName = playerMatch[2];
          const playerStat = playerStats[playerName] || {
            kills: '0',
            deaths: '0',
            score: 0,
          };

          players.push({
            userId,
            playerName,
            avatar: '/avatars/default.jpg',
            steam64: '',
            score: playerStat.score,
            admin: null,
            kills: playerStat.kills,
            deaths: playerStat.deaths,
          });
        }
      });
    }

    return {
      hostname: hostnameMatch?.[1]?.trim() || null,
      map,
      mapImage: map ? MAP_IMAGES[map.toLowerCase()] || null : null,
      players,
      maxPlayers,
      playersPercentage: maxPlayers
        ? Math.round((players.length / maxPlayers) * 100)
        : 0,
    };
  }
}
