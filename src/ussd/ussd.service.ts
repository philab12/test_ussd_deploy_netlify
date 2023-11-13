import { Injectable } from '@nestjs/common';
import { CreateUssdDto } from './dto/create-ussd.dto';
import { UpdateUssdDto } from './dto/update-ussd.dto';

@Injectable()
export class UssdService {
  create(createUssdDto: CreateUssdDto) {
    const {
      sessionId,
      serviceCode,
      phoneNumber,
      text,
  
    } = createUssdDto;

    let response= "";

    if(text === ""){
      //this is the first request. Note how we start the response with CON
      response = `CON What would you like to chcek ?
      1. My Account
      2. My phone Number`;
    } else if(text === "1"){
      //Business logic for first level response 
      response = `CON Choose account information you want to view
      1. Account Number
      2. Account Balance`;
    } else if(text === "2"){
      //Get the mobile number from firestore Database
  
      //Terminal Request
      response = `END Your phone number is ${phoneNumber}`
    } else if(text === "1*1"){
      const accountNumber = 'AC100101';
  
      //Terminal request start with END
      response = `END Your account number os ${accountNumber}`;
  
    } else if(text === "1*2"){
      //Get data from the database
      const balance = 'KES 10,000';
  
      //Terminal request start with END
      response = `END Your balance is ${balance}`;
    }

    return response
  }

  findAll() {
    return `This action returns all ussd`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ussd`;
  }

  update(id: number, updateUssdDto: UpdateUssdDto) {
    return `This action updates a #${id} ussd`;
  }

  remove(id: number) {
    return `This action removes a #${id} ussd`;
  }
}
