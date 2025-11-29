export interface GitHostStrategy {
  isPublicRepo(prUrl: string): boolean
  buildOAuthUrl(): void
}
