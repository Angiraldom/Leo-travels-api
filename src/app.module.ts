import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import configuration from './config';
import { enviroments } from './enviroments';

import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
