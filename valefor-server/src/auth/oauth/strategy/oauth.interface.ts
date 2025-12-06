export interface OAuthStrategy {
  exchangeToken(code: string, codeVerifier: string): Promise<unknown>;
}
