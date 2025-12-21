import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/base/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prismaService: PrismaService) {}

  @Get('')
  async ping() {
    return { status: 'okayy!!!?', timestamp: new Date() };
  }
}
