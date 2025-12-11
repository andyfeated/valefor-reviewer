import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('oauth/login')
  async login(
    @Body() body: { code: string; code_verifier: string; state: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code, code_verifier, state } = body;

    return this.authService.loginWithOauth(code, code_verifier, state, res);
  }

  @Get('my-profile')
  async myProfile() {}
}
