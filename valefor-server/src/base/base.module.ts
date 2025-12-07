import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TestService } from './test.service';

@Module({
  controllers: [],
  providers: [PrismaService, TestService],
  exports: [PrismaService, TestService],
})
export class BaseModule {}
