import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('')
  ping() {
    return { status: 'okayy!!!?', timestamp: new Date() };
  }
}
