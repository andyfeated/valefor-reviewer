import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/base/prisma.service';
import { GetOrCreateAccountDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOAuthIdentityByProviderId(
    provider: string,
    providerUserId: string,
  ) {
    return this.prisma.oAuthIdentity.findUnique({
      where: {
        provider_providerUserId: { provider, providerUserId },
      },
      include: { user: true },
    });
  }

  async findUserByEmail(email: string) {
    if (!email) return null;

    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { email: string; name: string; avatarUrl: string }) {
    return this.prisma.user.create({ data });
  }

  async createOAuthIdentity(data: {
    userId: string;
    provider: string;
    providerUserId: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }) {
    return this.prisma.oAuthIdentity.create({
      data,
    });
  }

  async updateOAuthIdentityTokens(
    id: string,
    data: { accessToken: string; refreshToken: string; expiresIn: number },
  ) {
    return this.prisma.oAuthIdentity.update({
      where: { id },
      data,
    });
  }

  async getOrCreateUser(dto: GetOrCreateAccountDto) {
    const {
      providerUserId,
      provider,
      email,
      name,
      accessToken,
      refreshToken,
      avatarUrl,
      expiresIn,
    } = dto;

    const expiresInComputed = Math.floor(Date.now() / 1000) + expiresIn;

    const identity = await this.findOAuthIdentityByProviderId(
      provider,
      providerUserId,
    );
    console.log('oauth identity', identity);

    if (identity) {
      await this.updateOAuthIdentityTokens(identity.id, {
        accessToken,
        refreshToken,
        expiresIn: expiresInComputed,
      });

      return identity.user;
    }

    let user = await this.findUserByEmail(email);

    if (!user) {
      user = await this.createUser({ email, name, avatarUrl });
    }

    await this.createOAuthIdentity({
      provider,
      providerUserId,
      accessToken,
      refreshToken,
      expiresIn,
      userId: user.id,
    });

    return user;
  }
}
