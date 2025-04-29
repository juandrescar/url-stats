import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { Stats } from './stats/entities/stats.entity';
import { StatsModule } from './stats/stats.module';
import { AuthModule } from './auth/auth.module';
import config from './config/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        RABBITMQ_URL: Joi.string().required(),
        RABBITMQ_QUEUE_URLS: Joi.string().required(),
        RABBITMQ_QUEUE_STATS: Joi.string().required(),
        APP_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    RabbitMQModule,
    StatsModule,
    TypeOrmModule.forFeature([Stats]),
    AuthModule
  ]
})
export class AppModule {}
