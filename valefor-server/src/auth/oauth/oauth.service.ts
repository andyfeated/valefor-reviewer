import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuthFactory } from './oauth.factory';
import { OAuthIdentity } from 'src/generated/prisma/client';
import { UserService } from 'src/user/user.service';

export class ExchangeOAuthDto {
  provider: string;
  code: string;
  codeVerifier: string;
}

@Injectable()
export class OAuthService {
  constructor(
    private factory: OAuthFactory,
    private userService: UserService,
  ) {}

  async exchangeCodeForToken(dto: ExchangeOAuthDto) {
    const oauthProvider = this.factory.get(dto.provider);

    const tokenData = await oauthProvider.exchangeToken(
      dto.code,
      dto.codeVerifier,
    );

    return tokenData;
  }

  async verifyIdToken(idToken: string, provider: string) {
    try {
      // Dynamic import to prevent ESM conflict
      const { createRemoteJWKSet, jwtVerify } = await import('jose');

      const oauthProvider = this.factory.get(provider);
      const issuer = oauthProvider.issuer;

      // NOTE: Refactor to make clientId private
      const openIdWellKnown = `${issuer}/.well-known/openid-configuration`;

      const res = await fetch(openIdWellKnown);
      const openIdConfig: any = await res.json();

      const JWKS = createRemoteJWKSet(new URL(openIdConfig.jwks_uri));

      const { payload } = await jwtVerify(idToken, JWKS, {
        issuer,
        audience: oauthProvider.clientId,
      });

      return payload;
    } catch (err) {
      throw new UnauthorizedException('Failed to verify token');
    }
  }

  async refreshOAuthToken(oauthIdentity: OAuthIdentity, provider: string) {
    const refreshToken = oauthIdentity.refreshToken;

    if (!oauthIdentity.refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const oauthProvider = this.factory.get(provider);
    const res = await oauthProvider.getNewAccessTokenFromProvider(refreshToken);

    const { access_token, refresh_token, expires_in } = res;

    await this.userService.updateOAuthIdentityTokens(oauthIdentity.id, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    });
  }
}
