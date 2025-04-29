import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from './entities/stats.entity';
import { ConfigType } from '@nestjs/config';
import config from 'src/config/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.db;
        return {
          type: 'mysql',
          host,
          port,
          username: user,
          password,
          database: dbName,
          synchronize: true,
          autoLoadEntities: true,
          timezone: 'Z',
        };
      },
    }),
    TypeOrmModule.forFeature([Stats]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
