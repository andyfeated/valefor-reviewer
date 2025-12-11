export class GetOrCreateAccountDto {
  provider: string;
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl: string;

  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
