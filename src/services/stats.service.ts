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
    let stat = await this.statsRepository.findOne({ where: { urlId } });

    if (stat) {
      stat.clicks += 1;
    } else {
      stat = this.statsRepository.create({ urlId, clicks: 1, browser, location });
    }

    return this.statsRepository.save(stat);
  }
}

