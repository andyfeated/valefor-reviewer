import { GitHostStrategy } from "./git-host.strategy";

export class GitlabStrategy implements GitHostStrategy {
  isPublicRepo(prUrl: string): boolean {
    console.log('gitlab strategy')
    return true
  }

  buildOAuthUrl(): void {
    console.log('works')
  }
}
