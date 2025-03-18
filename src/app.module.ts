import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from './rabbitmq.module';
import { AppController } from './controllers/app.controller';
import { StatsService } from './services/stats.service';
import { Stats } from './entities/stats.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    RabbitMQModule,
    TypeOrmModule.forFeature([Stats]),
  ],
  controllers: [AppController],
  providers: [AppService, StatsService],
})
export class AppModule {}
