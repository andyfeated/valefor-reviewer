import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuthStrategy } from './oauth.interface';

@Injectable()
export class GitlabOAuthStrategy implements OAuthStrategy {
  readonly issuer = 'https://gitlab.com';
  readonly clientId = process.env.GITLAB_API_CLIENT_ID;

  private tokenUrl = 'https://gitlab.com/oauth/token';
  private clientSecret = process.env.GITLAB_API_CLIENT_SECRET;
  private redirectUri = process.env.GITLAB_API_REDIRECT_URI;

  async exchangeToken(code: string, codeVerifier: string): Promise<unknown> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri,
    });

    const res = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: params,
    });

    if (!res.ok) {
      throw new BadRequestException(
        `Failed exchanging Gitlab code: ${res.statusText}`,
      );
    }

    return res.json();
  }

  async getNewAccessTokenFromProvider(refreshToken: string): Promise<any> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
    });

    const res = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: params,
    });

    if (!res.ok) {
      throw new UnauthorizedException('Failed to refresh access token');
    }

    return res.json();
  }
}
