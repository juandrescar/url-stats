import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from '../services/stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  // 📌 Obtener todas las estadísticas con paginación
  @Get()
  async getStatistics(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('browser') browser?: string,
    @Query('location') location?: string,
    @Query('urlId') urlId?: number,
  ) {
    return this.statsService.getStatistics({ page, limit, browser, location, urlId });
  }

  // 📌 Obtener estadísticas por día, semana o mes
  @Get('daily')
  async getDailyStats(@Query('date') date?: string) {
    return this.statsService.getStatsByDate('daily', date);
  }

  @Get('weekly')
  async getWeeklyStats(@Query('week') week?: string) {
    return this.statsService.getStatsByDate('weekly', week);
  }

  @Get('monthly')
  async getMonthlyStats(@Query('month') month?: string) {
    return this.statsService.getStatsByDate('monthly', month);
  }

  // 📌 Total de visitas por URL
  @Get('total')
  async getTotalVisits(@Query('urlId') urlId: number) {
    return this.statsService.getTotalVisits(urlId);
  }

  // 📌 Top navegadores usados
  @Get('top-browsers')
  async getTopBrowsers() {
    return this.statsService.getTopBrowsers();
  }

  // 📌 Top ubicaciones
  @Get('top-locations')
  async getTopLocations() {
    return this.statsService.getTopLocations();
  }

  // 📌 Historial de visitas por fecha
  @Get('history')
  async getHistory(@Query('urlId') urlId: number) {
    return this.statsService.getVisitHistory(urlId);
  }
}
