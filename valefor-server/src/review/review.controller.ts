import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OAuthTokenGuard } from 'src/auth/oauth/oauth.guard';
import { ReviewService } from './review.service';
import express from 'express';
import {
  distinctUntilChanged,
  interval,
  map,
  Observable,
  switchMap,
  takeWhile,
} from 'rxjs';

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
    const role = req.user.role;

    const prUrlObj = new URL(prUrl ?? null);

    if (prUrlObj.protocol !== 'https:') {
      throw new BadRequestException('Invalid URL');
    }

    if (prUrlObj.host !== `${gitHost}.com`) {
      throw new BadRequestException('Invalid PR URL');
    }

    const review = await this.reviewService.reviewPullRequest(
      prUrl,
      userId,
      role,
    );
    return review;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getReview(@Req() req: express.Request, @Param('id') reviewId: string) {
    const userId = req.user.sub;

    const review = await this.reviewService.getReview(reviewId, userId);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getReviews(
    @Req() req: express.Request,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const userId = req.user.sub;

    const reviews = await this.reviewService.getReviews(
      userId,
      Number(page) || 1,
      Number(pageSize) || 4,
    );

    return reviews;
  }

  @UseGuards(AuthGuard)
  @Sse(':id/events')
  reviewEvents(
    @Param('id') id: string,
    @Req() req: express.Request,
  ): Observable<MessageEvent> {
    const POLL_INTERVAL_MS = 1000;
    const userId = req.user.sub;

    return interval(POLL_INTERVAL_MS).pipe(
      switchMap(() => this.reviewService.getReview(id, userId)),
      distinctUntilChanged((prev, cur) => prev.status === cur.status),
      takeWhile((review) => review.status === 'pending', true),
      map((review) => {
        return {
          data: {
            status: review.status,
            updatedAt: review.updatedAt,
            diffs: review.diffs,
          },
        } as MessageEvent;
      }),
    );
  }
}
