import { Injectable } from '@nestjs/common';
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

    console.log(tokenData, 'here wohoo');
  }
}
