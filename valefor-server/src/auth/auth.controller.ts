import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('oauth/login')
  async login(
    @Body() body: { code: string; code_verifier: string; state: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code, code_verifier, state } = body;

    const user = await this.authService.loginWithOauth(
      code,
      code_verifier,
      state,
      res,
    );

    return user;
  }

  @Post('logout')
  logout(@Res() res: Response) {
    this.authService.logout(res);

    return res.json({ message: 'Logged out successfully' });
  }

  @UseGuards(AuthGuard)
  @Get('my-profile')
  async myProfile(@Req() req: any) {
    const { sub } = req.user;

    return this.authService.getUser(sub);
  }
}
