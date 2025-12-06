export interface OAuthProvider {
  exchangeToken(code: string, codeVerifier: string): Promise<unknown>;
}
