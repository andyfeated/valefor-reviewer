import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { BaseModule } from 'src/base/base.module';

@Module({
  controllers: [HealthController],
  imports: [BaseModule],
})
export class HealthModule {}
