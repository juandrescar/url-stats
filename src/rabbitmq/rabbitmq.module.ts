import { Module } from '@nestjs/common';
import { ClientsModule, Transport, ClientProviderOptions } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumer } from './rabbitmq.controller';
import { StatsModule } from '../stats/stats.module';
import { StatsService } from '../stats/stats.service';
import { Stats } from '../stats/entities/stats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from '../config/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    StatsModule,
    TypeOrmModule.forFeature([Stats]),
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE_URLS',
        imports: [ConfigModule],
        inject: [config.KEY],
        useFactory: (cfg: ConfigType<typeof config>) : ClientProviderOptions => ({
          name: 'RABBITMQ_SERVICE_URLS',
          transport: Transport.RMQ,
          options: {
            urls: [ cfg.rabbitmq.urls ],
            queue: cfg.rabbitmq.queueUrls,
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'RABBITMQ_SERVICE_STATS',
        imports: [ConfigModule],
        inject: [config.KEY],
        useFactory: (cfg: ConfigType<typeof config>) : ClientProviderOptions => ({
          name: 'RABBITMQ_SERVICE_STATS',
          transport: Transport.RMQ,
          options: {
            urls: [cfg.rabbitmq.urls],
            queue: cfg.rabbitmq.queueStats,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [RabbitMQConsumer],
  providers: [RabbitMQService, StatsService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}