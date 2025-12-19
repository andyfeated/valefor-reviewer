import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { OAuthService } from './oauth.service';

@Injectable()
export class OAuthTokenGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private oauthService: OAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User is not authorized');
    }

    const provider = req.params?.githost;

    if (provider !== 'github' && provider !== 'gitlab') {
      throw new BadRequestException('Invalid provider');
    }

    const oauthIdentity = await this.userService.getOAuthIdentity(
      userId,
      provider,
    );

    const expiresInMs = oauthIdentity.expiresIn * 1000;

    console.log('Expires at:', new Date(expiresInMs).toLocaleString());
    console.log('Current time:', new Date().toLocaleString());

    if (expiresInMs < new Date().getTime()) {
      this.oauthService.refreshOAuthToken(oauthIdentity, provider);
    }

    return true;
  }
}
