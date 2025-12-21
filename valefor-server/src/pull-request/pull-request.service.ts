import { Injectable } from '@nestjs/common';
import { GitHostFactory } from 'src/git-host/factory/git-host.factory';

@Injectable()
export class PullRequestService {
  constructor(private readonly gitHostFactory: GitHostFactory) {}
}
