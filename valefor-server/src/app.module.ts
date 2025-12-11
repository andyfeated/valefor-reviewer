import { Module } from '@nestjs/common';
import { PullRequestModule } from './pull-request/pull-request.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaService } from './base/prisma.service';
import { BaseModule } from './base/base.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    BaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PullRequestModule,
    UserModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
