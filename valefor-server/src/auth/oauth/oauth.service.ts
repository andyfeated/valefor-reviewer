import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuthFactory } from './oauth.factory';

export class ExchangeOAuthDto {
  provider: string;
  code: string;
  codeVerifier: string;
}

@Injectable()
export class OAuthService {
  constructor(private factory: OAuthFactory) {}

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
}
