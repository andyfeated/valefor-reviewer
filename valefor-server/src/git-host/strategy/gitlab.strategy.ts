import { GitHostStrategy } from './git-host.strategy';

export class GitlabStrategy implements GitHostStrategy {
  isPublicRepo(prUrl: string): boolean {
    return true;
  }

  exhangeCodeForToken(): void {}
}
