import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/base/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prismaService: PrismaService) {}

  @Get('')
  async ping() {
    const count = await this.prismaService.user.count();
    return { status: 'okayy!!!?', timestamp: new Date() };
  }
}
