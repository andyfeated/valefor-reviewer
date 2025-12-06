export interface GitHostStrategy {
  isPublicRepo(prUrl: string): boolean;
  exhangeCodeForToken(): void;
}
