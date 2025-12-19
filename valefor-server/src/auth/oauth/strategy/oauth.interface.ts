export interface OAuthStrategy {
  issuer: string;
  clientId: string;

  exchangeToken(code: string, codeVerifier: string): Promise<unknown>;
  getNewAccessTokenFromProvider(refreshToken: string): Promise<any>;
}
