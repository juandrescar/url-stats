import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import config from '../config/config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private clientUrls: ClientProxy;
  private clientStats: ClientProxy;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    @Inject(config.KEY)
    private readonly cfg: ConfigType<typeof config>,
  ) {}

  onModuleInit() {
    this.clientUrls = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.cfg.rabbitmq.urls],
        queue: this.cfg.rabbitmq.queueUrls,
        queueOptions: { durable: true },
      },
    });

    this.clientStats = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.cfg.rabbitmq.urls],
        queue: this.cfg.rabbitmq.queueStats,
        queueOptions: { durable: true },
      },
    });
    this.logger.log('✅ Conectado a RabbitMQ');
  }

  async sendUrlMessage(data: any) {
    return this.clientUrls.emit(this.cfg.rabbitmq.queueUrls, data);
  }

  async sendStatsMessage(data: any) {
    this.logger.log('✅ sendStatsMessage');
    return this.clientStats.emit(this.cfg.rabbitmq.queueStats, data);
  }
}
