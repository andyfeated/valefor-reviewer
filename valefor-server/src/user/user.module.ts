import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseModule } from 'src/base/base.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [BaseModule],
})
export class UserModule {}
