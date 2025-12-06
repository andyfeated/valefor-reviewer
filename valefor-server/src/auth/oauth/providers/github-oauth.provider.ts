import { Injectable } from '@nestjs/common';
import { OAuthProvider } from './oauth.interface';

@Injectable()
export class GithubOAuthProvider implements OAuthProvider {
  exchangeToken(code: string, codeVerifier: string): Promise<unknown> {
    return Promise.resolve();
  }
}
