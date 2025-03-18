import { Controller } from '@nestjs/common';
import { StatsService } from '../services/stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
}
