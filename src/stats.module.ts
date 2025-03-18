import { Module } from '@nestjs/common';
import { StatsController } from './controllers/stats.controller';
import { StatsService } from './services/stats.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from './entities/stats.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Stats]),
    ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
