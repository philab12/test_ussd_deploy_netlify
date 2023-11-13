import { Module } from '@nestjs/common';
import { UssdService } from './ussd.service';
import { UssdController } from './ussd.controller';

@Module({
  controllers: [UssdController],
  providers: [UssdService],
})
export class UssdModule {}
