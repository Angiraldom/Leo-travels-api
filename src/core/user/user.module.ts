import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserSchema } from './schema/user.schema';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema, collection: 'Users' },
    ]),
    SharedModule,
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
