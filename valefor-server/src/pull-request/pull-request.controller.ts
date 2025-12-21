import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PullRequestService } from './pull-request.service';

@Controller('pull-request')
export class PullRequestController {
  constructor(private readonly pullRequestService: PullRequestService) {}

  @Get()
  getPullRequest(@Query('prUrl') prUrl: string) {
    if (!prUrl) {
      throw new BadRequestException('Pull Request URL is required');
    }
  }
}
