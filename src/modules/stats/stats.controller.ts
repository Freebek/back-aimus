import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ListStatsDto } from './dto/list-stats.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async list(@Query() query: ListStatsDto) {
    const result = await this.statsService.listPlayers({
      host: query.host,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });

    return {
      success: true,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        db: result.db,
      },
      data: result.data,
    };
  }
}
