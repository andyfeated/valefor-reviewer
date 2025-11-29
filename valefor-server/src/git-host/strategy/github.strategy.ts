
import { GitHostStrategy } from "./git-host.strategy";

export class GithubStrategy implements GitHostStrategy {
  isPublicRepo(prUrl: string): boolean {
    console.log('github strategy')
    return true
  }

  buildOAuthUrl(): void {
    console.log('works')
  }
}
