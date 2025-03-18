import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private clientUrls: ClientProxy;
  private clientStats: ClientProxy;

  onModuleInit() {
    this.clientUrls = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@rabbitmq:5672'],
        queue: 'urls_queue',
        queueOptions: { durable: true },
      },
    });

    this.clientStats = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@rabbitmq:5672'],
        queue: 'urls_statistics',
        queueOptions: { durable: true },
      },
    });

    console.log('✅ Conectado a RabbitMQ');
  }

  async sendUrlMessage(data: any) {
    return this.clientUrls.emit('urls_queue', data);
  }

  async sendStatsMessage(data: any) {
    console.log('✅ sendStatsMessage');
    return this.clientStats.emit('urls_statistics', data);
  }
}
