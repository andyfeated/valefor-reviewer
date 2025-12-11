import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { OAuthService } from './oauth/oauth.service';
import { UserService } from 'src/user/user.service';
import { GetOrCreateAccountDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private oauthService: OAuthService,
    private userService: UserService,
  ) {}

  @Post('oauth/login')
  async login(
    @Body() body: { code: string; code_verifier: string; state: string },
  ) {
    const { code, code_verifier, state } = body;

    try {
      const decodedState = JSON.parse(atob(state));
      const provider = decodedState.provider;

      const tokenData: any = await this.oauthService.exchangeCodeForToken({
        code,
        codeVerifier: code_verifier,
        provider,
      });

      const idPayload = await this.oauthService.verifyIdToken(
        tokenData.id_token,
        provider,
      );

      const dto: GetOrCreateAccountDto = {
        email: idPayload.email as string,
        name: idPayload.name as string,
        avatarUrl: idPayload.picture as string,

        provider,
        providerUserId: idPayload.sub,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      };

      const user = await this.userService.getOrCreateUser(dto);

      console.log('user', user);
      // create jwt with 4h lifespan
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
