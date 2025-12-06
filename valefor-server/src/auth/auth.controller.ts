import { Body, Controller, Post } from '@nestjs/common';
import { OAuthService } from './oauth/oauth.service';

@Controller('auth')
export class AuthController {
  constructor(private oauthService: OAuthService) {}

  @Post('oauth/exchange')
  async exchange(
    @Body() body: { code: string; code_verifier: string; state: string },
  ) {
    const { code, code_verifier, state } = body;

    const decodedState = JSON.parse(atob(state));
    const provider = decodedState.provider;

    return this.oauthService.exchangeCodeForToken({
      code,
      codeVerifier: code_verifier,
      provider,
    });
  }
}
