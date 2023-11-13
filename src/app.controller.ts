import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UssdDto } from './common/dto/ussd.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @Header('content-type', 'text/plain')
  async postUssd(@Body() ussdDto: UssdDto, res: Response): Promise<any> {
    const responsey = this.appService.ussd(ussdDto);

    // res.set('Content-Type: application/json');
   return responsey


  }
}
