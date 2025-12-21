import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OAuthTokenGuard } from 'src/auth/oauth/oauth.guard';
import { ReviewService } from './review.service';
import express from 'express';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(AuthGuard, OAuthTokenGuard)
  @Post(':githost')
  async review(
    @Req() req: express.Request,
    @Param('githost') gitHost: string,
    @Body() body: { prUrl: string },
  ) {
    const { prUrl } = body;
    const userId = req.user.sub;

    const prUrlObj = new URL(prUrl ?? null);

    if (prUrlObj.protocol !== 'https:') {
      throw new BadRequestException('Invalid URL');
    }

    if (prUrlObj.host !== `${gitHost}.com`) {
      throw new BadRequestException('Invalid PR URL');
    }

    const review = await this.reviewService.reviewPullRequest(prUrl, userId);
    return review;
  }
}
