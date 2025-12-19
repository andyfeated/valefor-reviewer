import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OAuthTokenGuard } from 'src/auth/oauth/oauth.guard';
import { GitHostFactory } from 'src/git-host/factory/git-host.factory';

@Controller('review')
export class ReviewController {
  @UseGuards(AuthGuard, OAuthTokenGuard)
  @Post(':githost')
  async review(
    @Param('githost') gitHost: string,
    @Body() body: { prUrl: string },
  ) {
    const { prUrl } = body;

    const prUrlObj = new URL(prUrl ?? null);

    if (prUrlObj.protocol !== 'https:') {
      throw new BadRequestException('Invalid URL');
    }

    if (prUrlObj.host !== `${gitHost}.com`) {
      throw new BadRequestException('Invalid PR URL');
    }

    const githost = new GitHostFactory().create(prUrl);

    const { projectId, pullRequestId } =
      githost.extractPullRequestDetailsFromUrl(prUrl);

    console.log(projectId, pullRequestId);
  }
}
