import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ReviewController],
  providers: [],
  exports: [],
  imports: [UserModule, AuthModule],
})
export class ReviewModule {}
