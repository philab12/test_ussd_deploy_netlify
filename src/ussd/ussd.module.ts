import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UssdService } from './ussd.service';
import { UssdController } from './ussd.controller';
import { HttpModule } from '@nestjs/axios';
import { XMLMiddleware } from './middlewares/xml.middleware';

@Module({
  imports:[HttpModule],
  controllers: [UssdController],
  providers: [UssdService],
})
export class UssdModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XMLMiddleware)
      .forRoutes({
        path: '/',
        method: RequestMethod.ALL
      }); 
    
  }

}
