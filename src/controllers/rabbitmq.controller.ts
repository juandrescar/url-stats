import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx, EventPattern } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { StatsService } from '../services/stats.service';


@Controller()
export class RabbitMQConsumer {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  constructor(private readonly reflector: Reflector, private readonly statsService: StatsService,) {}

  onModuleInit() {
    const patterns = Reflect.getMetadataKeys(this);
    this.logger.log(`📌 Claves de metadatos en el controlador: ${JSON.stringify(patterns)}`);

    if (patterns.length === 0) {
      this.logger.error('❌ No se detectaron patrones de mensajes. Verifica @MessagePattern()');
    }
  }

  @MessagePattern('urls_queue')
  handleUrlMessage(@Payload() data: any) {
    this.logger.log(`📥 Recibido en urls_queue: ${JSON.stringify(data)}`);
  }

  @MessagePattern('urls_statistics')
  async handleStatsMessage2(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log('📦 Mensaje recibido en urls_statistics:', JSON.stringify(data, null, 2));

    console.log(`Context: ${context.getMessage()}`);
    console.log(`chanel: ${context.getChannelRef()}`);
    console.log(`ARGS: ${context.getArgs()}`);
    console.log(`Pattern: ${context.getPattern()}`);
  }
}
