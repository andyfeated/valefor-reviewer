import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaService } from './base/prisma.service';
import { BaseModule } from './base/base.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    BaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    ReviewModule,
    UserModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
