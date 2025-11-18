import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import {
  DB_HOSTS,
  DEFAULT_HOST,
  DB_NAME_TO_LABEL,
  DbCredentials,
} from './db-hosts.constants';
import { fetchSteamAvatars } from './steam-avatar.util';
import * as process from 'process';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);
  private pools: Map<string, Pool> = new Map();

  constructor() {}

  private steam32To64(steam32: string): string {
    const parts = steam32.split(':');
    const Y = parseInt(parts[1]);
    const Z = parseInt(parts[2]);
    const steam64 = BigInt(Z) * 2n + 76561197960265728n + BigInt(Y);
    return steam64.toString();
  }

  private getSteamLink(steamId: string): string {
    try {
      const steam64 = this.steam32To64(steamId);
      return `https://steamcommunity.com/profiles/${steam64}/`;
    } catch (err) {
      this.logger.warn(
        `Failed to convert steam ID ${steamId} to steam64: ${err}`,
      );
      return '';
    }
  }

  private getCredentialsFromHostInput(hostInput?: string): DbCredentials {
    const hostLabel = hostInput || DEFAULT_HOST;

    // accept friendly label
    if (DB_HOSTS[hostLabel]) return DB_HOSTS[hostLabel];

    // accept raw db name if present in mapping
    if (DB_NAME_TO_LABEL[hostLabel]) {
      const friendlyLabel = DB_NAME_TO_LABEL[hostLabel];
      return DB_HOSTS[friendlyLabel];
    }

    // otherwise default
    return DB_HOSTS[DEFAULT_HOST];
  }

  private async getPoolForDb(credentials: DbCredentials): Promise<Pool> {
    const poolKey = `${credentials.host}:${credentials.port}:${credentials.database}`;
    const cached = this.pools.get(poolKey);
    if (cached) return cached;

    try {
      const pool = createPool({
        host: credentials.host,
        port: credentials.port,
        user: credentials.username,
        password: credentials.password,
        database: credentials.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: 'Z',
      });

      this.pools.set(poolKey, pool);
      this.logger.log(
        `Created MySQL pool for ${credentials.host}:${credentials.port}/${credentials.database}`,
      );
      return pool;
    } catch (err) {
      this.logger.error(
        `Failed to create pool for ${credentials.host}:${credentials.port}/${credentials.database}`,
        err as any,
      );
      throw new BadRequestException(
        `Cannot connect to database: ${credentials.database}`,
      );
    }
  }

  async listPlayers(options: {
    host?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const credentials = this.getCredentialsFromHostInput(options.host);
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 20;
    const offset = (page - 1) * limit;

    const pool = await this.getPoolForDb(credentials);

    // build where clause
    const whereParts: string[] = [];
    const params: any[] = [];

    if (options.search) {
      whereParts.push('(name LIKE ? OR steam LIKE ?)');
      const like = `%${options.search}%`;
      params.push(like, like);
    }

    const where = whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : '';

    try {
      // fetch total
      const countSql = `SELECT COUNT(*) as total FROM lvl_base ${where}`;
      const [countRows] = await pool.query(countSql, params);
      const total =
        Array.isArray(countRows) && countRows[0]
          ? (countRows[0] as any).total
          : 0;

      const sql = `SELECT steam, name, value, rank, kills, deaths, shoots, hits, headshots, assists, round_win, round_lose, playtime, lastconnect FROM lvl_base ${where} ORDER BY rank DESC LIMIT ? OFFSET ?`;
      const rowsParams = params.concat([limit, offset]);
      const [rows] = await pool.query(sql, rowsParams);

      // map rows and add steam_link and collect id64s
      const data = (Array.isArray(rows) ? rows : []).map((row: any) => {
        const steam64 = this.steam32To64(row.steam);
        return {
          ...row,
          steam_link: `https://steamcommunity.com/profiles/${steam64}/`,
          steam64,
        };
      });

      // fetch avatars in batch
      const apiKey = process.env.STEAM_API_KEY;
      const steamIds = data.map((d) => d.steam64);
      const avatarMap = await fetchSteamAvatars(steamIds, apiKey);

      // add avatar param to each player
      const dataWithAvatar = data.map((row) => ({
        ...row,
        avatar: avatarMap[row.steam64] || '',
      }));

      return {
        data: dataWithAvatar,
        total: Number(total),
        page,
        limit,
        db: credentials.database,
      };
    } catch (err) {
      this.logger.error(
        `Error querying database=${credentials.database}`,
        err as any,
      );
      throw err;
    }
  }
}
