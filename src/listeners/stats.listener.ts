import { Injectable } from '@nestjs/common';
import { StatsService } from '../services/stats.service';
import { RabbitMQService } from 'src/services/rabbitmq.service';

@Injectable()
export class StatsListener {
  constructor(
    private readonly statsService: StatsService,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  async listenToQueue() {
    // this.rabbitMQService.send('url_visited', async (message) => {
    //   const { urlId, browser, location } = JSON.parse(message.content.toString());
    //   await this.statsService.recordVisit(urlId, browser, location);
    // });
  }
}