import { Injectable } from '@nestjs/common';
import { OAuthStrategy } from './oauth.interface';

@Injectable()
export class GithubOAuthStrategy implements OAuthStrategy {
  exchangeToken(code: string, codeVerifier: string): Promise<unknown> {
    return Promise.resolve();
  }
}
