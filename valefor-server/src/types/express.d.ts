import 'express';

declare module 'express' {
  interface Request {
    user?: {
      sub: string;
      email?: string;
      iat?: number;
      exp?: number;
    };
  }
}
