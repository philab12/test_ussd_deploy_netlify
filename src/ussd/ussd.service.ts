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

    //var textValue = text.split('*').length;

    let response= "";

    const merchantCode = "M10001";
    const recipientCode = "R10001";

    let amount_pay;

    if(text === ""){
      //this is the first request. Note how we start the response with CON
      response = `CON Welcome to PeoplesPay ?
      1. Check Balance
      2. Make Payment
      3. Accept Payment
      4. Make a Donation
      `;
    } else if(text === "1"){
      //Business logic for first level response 
      response = `CON Enter The Merchant Code`;
    } else if(text === "2"){
      //Get the mobile number from firestore Database
  
      //Terminal Request
      response = `CON Enter The Merchant Code`
    } else if(text === "3"){
      response = `CON Enter Your Merchant Code`;
  
    } else if(text === "4"){
      response = `CON Enter Recipient Code`;
    } else if(text === `1*${merchantCode}`){
      const balance = "ghc2000";
      response = `END Your Balance Is ${balance}`
    } else if(text === `2*${merchantCode}`){
      response = `CON Enter Amount to Pay`;

     // amount_pay = text.split("*")[2];
  
    } else if(text === `3*${merchantCode}`){
      response = `CON Enter Amount to pay`;
      const amount = text.split("*")[2];
      response = `CON Enter Payee Wallet Number`;
      const walletNumber = text.split("*")[3];
      //API Goes Here
      response = `END Payee Wallet Number Is ${walletNumber}`

    }else if(text === `4*${recipientCode}`){
      response = `CON Enter Donation Amount`
      const damount = text.split("*")[2];
      //API Goes Here
      response = `END Donation Amount Is ${damount}`
    }else if(text === `2*${merchantCode}*5}`){
      // response = `CON Enter Amount to Pay`;
      // const amount = text.split("*")[2];
      //Api Goes Here
      //const amt = text.split("*");
      response = `END Your Amount Entered Is ${text}`
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
