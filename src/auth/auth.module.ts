import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    HttpModule
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}