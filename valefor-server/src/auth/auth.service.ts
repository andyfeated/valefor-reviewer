import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OAuthService } from './oauth/oauth.service';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { GetOrCreateAccountDto } from 'src/user/user.dto';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private oauthService: OAuthService,
    private userService: UserService,
  ) {}

  async loginWithOauth(
    code: string,
    codeVerifier: string,
    state: string,
    res: Response,
  ) {
    try {
      const decodedState = JSON.parse(atob(state));
      const provider = decodedState.provider;

      const tokenData: any = await this.oauthService.exchangeCodeForToken({
        code,
        codeVerifier,
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

      const jwtToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '4h' },
      );

      // res.cookie sends back to browser
      res.cookie('auth_token', jwtToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 4,
      });

      return user;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(id: string) {
    return this.userService.findUserById(id);
  }

  logout(res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { isCompleted: true };
  }
}
