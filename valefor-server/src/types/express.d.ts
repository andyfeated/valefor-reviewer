import 'express';
import { Role } from 'src/generated/prisma/enums';

declare module 'express' {
  interface Request {
    user?: {
      sub: string;
      role?: Role;
      email?: string;
      iat?: number;
      exp?: number;
    };
  }
}
