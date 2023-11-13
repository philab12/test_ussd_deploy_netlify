import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import {config} from "dotenv";
import { IsUniqueConstraint } from './common/validation/is-unique-constraint';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MailerModule } from '@nestjs-modules/mailer';
// import {join} from 'path';
// import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"
import { UssdModule } from './ussd/ussd.module';





config();


@Module({
  // imports: [ConfigModule.forRoot({
  //   envFilePath: ".env"
  // }), TypeOrmModule.forRoot(dataSourceOptions), EventEmitterModule.forRoot(),ScheduleModule.forRoot(), AppModule],
  imports:[UssdModule],
  controllers: [],
  providers: [],
  // providers: [IsUniqueConstraint, AppService],
})
export class AppModule {
  // constructor(){
  //   console.log("host", `${process.env.MYSQL_HOST}`)
  // }
}
