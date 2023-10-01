import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserSchema } from './schema/user.schema';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { PotentialCustomerSchema, PotentialCustomer } from './schema/potentialCustomers';
import { PotentialClientController } from './controller/potentialCustomers.controller';
import { PotentialCustomerService } from './service/potentialCustomer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Users', schema: UserSchema, collection: 'Users' },
      { name: PotentialCustomer.name, schema: PotentialCustomerSchema },
    ]),
    SharedModule,
    JwtModule,
  ],
  controllers: [UserController, PotentialClientController],
  providers: [UserService, PotentialCustomerService],
  exports: [UserService],
})
export class UserModule {}
