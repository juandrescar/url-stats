import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from '../entities/stats.entity';

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
  
    if (period === 'daily') {
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
  
      const rows = await query
        .select("DATE(stat.createdAt)", "period")
        .addSelect("COUNT(*)", "visits")
        .where("YEAR(stat.createdAt) = :year AND MONTH(stat.createdAt) = :month", { year, month })
        .groupBy("DATE(stat.createdAt)")
        .orderBy("DATE(stat.createdAt)", "ASC")
        .getRawMany();

        return rows.map(row => ({
          period: new Date(row.period).toISOString().split('T')[0],
          visits: +row.visits,
        }));
  
    } else if (period === 'weekly') {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      console.log({
        start: startDate.toISOString().split('T')[0],
        end: today.toISOString(),
      })

      return await query
        .select("DATE(stat.createdAt)", "period")
        .addSelect("COUNT(*)", "visits")
        .where("stat.createdAt BETWEEN :start AND :end", {
          start: startDate.toISOString().split('T')[0],
          end: today.toISOString(),
        })
        .groupBy("DATE(stat.createdAt)")
        .orderBy("period", "ASC")
        .getRawMany()
        .then((rows) =>
          rows.map((row) => ({
            period: row.period.toISOString().split('T')[0],
            visits: +row.visits,
          }))
        );
  
    } else if (period === 'monthly') {
      const year = today.getFullYear();
  
      return await query
        .select("YEAR(stat.createdAt) AS year")
        .addSelect("MONTH(stat.createdAt) AS month")
        .addSelect("COUNT(*)", "visits")
        .where("YEAR(stat.createdAt) = :year", { year })
        .groupBy("YEAR(stat.createdAt), MONTH(stat.createdAt)")
        .orderBy("year, month", "ASC")
        .getRawMany()
        .then((rows) =>
          rows.map((row) => ({
            period: `${row.year}-${String(row.month).padStart(2, '0')}`,
            visits: +row.visits,
          }))
        );
    }
  
    return [];
  }

  async getTotalVisits(urlId: number) {
    return this.statsRepository.count({ where: { urlId } });
  }

  async getTopBrowsers() {
    return this.statsRepository
      .createQueryBuilder('stat')
      .select('stat.browser, COUNT(stat.browser) as count')
      .groupBy('stat.browser')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  async getTopLocations() {
    return this.statsRepository
      .createQueryBuilder('stat')
      .select('stat.location, COUNT(stat.location) as count')
      .groupBy('stat.location')
      .orderBy('count', 'DESC')
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

