import { GitHostStrategy } from './git-host.strategy';

export class GithubStrategy implements GitHostStrategy {
  isPublicRepo(prUrl: string): boolean {
    return true;
  }

  exhangeCodeForToken(): void {}
}
