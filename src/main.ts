import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new Logger("Main");
  app.useLogger(logger);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: 'urls_statistics',
      queueOptions: { durable: true },
    },
  });

  await microservice.listen();
  logger.log(`Application started on ${port} port`);
  console.log('✅ Microservicio conectado a RabbitMQ');
}
bootstrap();
