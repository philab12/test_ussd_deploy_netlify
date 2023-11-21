import { Controller, Get, Post, Body, Patch, Param, Delete, Header } from '@nestjs/common';
import { UssdService } from './ussd.service';
import { CreateUssdDto } from './dto/create-ussd.dto';
import { UpdateUssdDto } from './dto/update-ussd.dto';

@Controller('ussd')
export class UssdController {
  constructor(private readonly ussdService: UssdService) {}

  @Post()
  @Header('content-type', 'text/plain')
  async create(@Body() createUssdDto: CreateUssdDto) {
    const responsey =  await this.ussdService.create(createUssdDto);
    return responsey
  }

  // @Get()
  // findAll() {
  //   return this.ussdService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ussdService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUssdDto: UpdateUssdDto) {
  //   return this.ussdService.update(+id, updateUssdDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ussdService.remove(+id);
  // }
}
