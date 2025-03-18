import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './services/rabbitmq.service';
import { RabbitMQConsumer } from './controllers/rabbitmq.controller';
import { StatsModule } from './stats.module';
import { StatsService } from './services/stats.service';
import { Stats } from './entities/stats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    StatsModule,
    TypeOrmModule.forFeature([Stats]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE_URLS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'urls_queue',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'RABBITMQ_SERVICE_STATS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'urls_statistics',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [RabbitMQConsumer],
  providers: [RabbitMQService, StatsService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}