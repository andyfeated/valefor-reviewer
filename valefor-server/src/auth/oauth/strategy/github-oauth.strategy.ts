import { Injectable } from '@nestjs/common';
import { OAuthStrategy } from './oauth.interface';

@Injectable()
export class GithubOAuthStrategy implements OAuthStrategy {
  readonly issuer = 'https://github.com';
  readonly clientId: string;

  exchangeToken(code: string, codeVerifier: string): Promise<unknown> {
    return Promise.resolve();
  }
}
