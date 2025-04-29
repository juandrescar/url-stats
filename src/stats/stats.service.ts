import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from '../stats/entities/stats.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private statsRepository: Repository<Stats>,
  ) {}

  async recordVisit(urlId: number, browser: string, location: string) {
    const stat = this.statsRepository.create({ urlId, browser, location });
    return this.statsRepository.save(stat);
  }

  async getStatistics(filters: { page: number; limit: number; browser?: string; location?: string; urlId?: number }) {
    const { page, limit, browser, location, urlId } = filters;

    const query = this.statsRepository.createQueryBuilder('stat');

    if (browser) {
      query.andWhere('stat.browser = :browser', { browser });
    }

    if (location) {
      query.andWhere('stat.location = :location', { location });
    }

    if (urlId) {
      query.andWhere('stat.urlId = :urlId', { urlId });
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async getStatsByDate(period: 'daily' | 'weekly' | 'monthly', date?: string) {
    const today = date ? new Date(date) : new Date();
    const query = this.statsRepository.createQueryBuilder('stat');
  
    let startDate: Date;
    let endDate: Date;
  
    if (period === 'daily') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today);
    } else if (period === 'weekly') {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      endDate = new Date(today);
    } else if (period === 'monthly') {
      return this.getMonthlyStats(today, query);
    } else {
      return [];
    }
  
    // Ajustar horas de inicio y fin del día
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  
    const rawStats = await query
      .select("DATE(stat.createdAt)", "period")
      .addSelect("COUNT(*)", "visits")
      .where("stat.createdAt BETWEEN :start AND :end", {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().slice(0, 10) + " " + endDate.toISOString().slice(11, -1),
      })
      .groupBy("DATE(stat.createdAt)")
      .orderBy("period", "ASC")
      .getRawMany();
  
    const visitsMap = new Map(
      rawStats.map((row: any) => [row.period.toISOString?.().split('T')[0] ?? row.period, +row.visits])
    );
  
    const result = [];
    const daysCount = period === 'weekly' ? 7 : today.getDate();
  
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const formatted = date.toISOString().split('T')[0];
      result.push({
        period: formatted,
        visits: visitsMap.get(formatted) || 0,
      });
    }
  
    return result;
  }
  
  private async getMonthlyStats(today: Date, query: any) {
    const year = today.getFullYear();
  
    const rawStats = await query
      .select("YEAR(stat.createdAt)", "year")
      .addSelect("MONTH(stat.createdAt)", "month")
      .addSelect("COUNT(*)", "visits")
      .where("YEAR(stat.createdAt) = :year", { year })
      .groupBy("YEAR(stat.createdAt), MONTH(stat.createdAt)")
      .orderBy("month", "ASC")
      .getRawMany();
  
    const visitsMap = new Map(
      rawStats.map((row: any) => {
        const month = String(row.month).padStart(2, '0');
        return [`${row.year}-${month}`, +row.visits];
      })
    );
  
    const result = [];
    for (let m = 1; m <= today.getMonth() + 1; m++) {
      const formattedMonth = String(m).padStart(2, '0');
      const key = `${year}-${formattedMonth}`;
      result.push({
        period: key,
        visits: visitsMap.get(key) || 0,
      });
    }
  
    return result;
  }
  

  async getTotalVisits(urlId: number) {
    return this.statsRepository.count({ where: { urlId } });
  }

  async getTopBrowsers() {
    return this.statsRepository
      .createQueryBuilder('stat')
      .select('stat.browser, COUNT(stat.browser) as visits')
      .groupBy('stat.browser')
      .orderBy('visits', 'DESC')
      .getRawMany();
  }

  async getStatsGroupedByBrowser() {
    return this.statsRepository
      .createQueryBuilder('stat')
      .select('stat.browser', 'browser')
      .addSelect('COUNT(*)', 'visits')
      .groupBy('stat.browser')
      .orderBy('visits', 'DESC')
      .getRawMany();
  }

  async getTopLocations() {
    return this.statsRepository
      .createQueryBuilder('stat')
      .select('stat.location, COUNT(stat.location) as visits')
      .groupBy('stat.location')
      .orderBy('visits', 'DESC')
      .getRawMany();
  }

  async getStatsGroupedByLocation() {
    return this.statsRepository
      .createQueryBuilder('stat')
      .select('stat.location', 'location')
      .addSelect('COUNT(*)', 'visits')
      .groupBy('stat.location')
      .orderBy('visits', 'DESC')
      .getRawMany();
  }

  async getVisitHistory(urlId: number) {
    return this.statsRepository
      .createQueryBuilder('stat')
      .where('stat.urlId = :urlId', { urlId })
      .orderBy('stat.createdAt', 'ASC')
      .getMany();
  }
}

