import { Injectable } from '@nestjs/common';
import { CreateUssdDto } from './dto/create-ussd.dto';
import { UpdateUssdDto } from './dto/update-ussd.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';



@Injectable()
export class UssdService {


   constructor(private httpService: HttpService){}

  async create(createUssdDto: CreateUssdDto) {
    const { sessionId, serviceCode, phoneNumber, text } = createUssdDto;

    //var textValue = text.split('*').length;

    //let response = '';

    const merchantCode = 'M10001';
    let narration ="";
    //let network = "";
    //const recipientCode = 'R10001';


    // if (text === '') {
    //   return `CON Welcome to PeoplesPay ?
    //   1. Check Balance
    //   2. Make Payment
    //   3. Accept Payment
    //   4. Make a Donation
    //   `;
    // }

    
     
    
    // if(text === "1"){
    //   //Business logic for first level response
    //   const response = `CON Enter The Merchant Code`;
    //   return response;
    // } else if(text === "2"){
    //   //Get the mobile number from firestore Database

    //   //Terminal Request
    //   const response = `CON Enter The Merchant Code`
    //   return response;
    // } else if(text === "3"){
    //   const response = `CON Enter Your Merchant Code`;
    //   return response;
    // } else if(text === "4"){
    //   const response = `CON Enter Recipient Code`;
    //   return response;
    // } else if(text === `1*${merchantCode}`){
    //   const balance = "ghc2000";
    //   const response = `END Your Balance Is ${balance}`;
    //   return response;
    // } else if(text === `2*${merchantCode}`){
    //   const response = `CON Enter Amount to Pay`;
    //   return response;

    //  // amount_pay = text.split("*")[2];

    // } else if(text === `3*${merchantCode}`){
    //   const response = `CON Enter Amount to pay`;
    //   return response;

    // }else if(text === `4*${recipientCode}`){
    //   const response = `CON Enter Donation Amount`;
    //   return response;

    // }else if(text){
    //   // response = `CON Enter Amount to Pay`;
    //   // const amount = text.split("*")[2];
    //   //Api Goes Here
    //   //const amt = text.split("*");
    //   const response = `END Your Amount Entered Is ${text}`;
    //   return response;
    // }

    let level = [];
    if(text.includes("*")){
     level = text.split("*");

    }
    if(text == ""){
      return `CON Welcome to PeoplesPay ?
      1. Check Balance
      2. Make Payment
      3. Accept Payment
      4. Make a Donation
      `;
    }
    else if(text == "1" || text == "2" || text == "3" || text == "4" || parseInt(text) > 4){
      let response:string;
      if (text === '1' || text === '3') response = `CON Enter Your Merchant Code`;
      else if (text === '2') response = `CON Enter The Merchant Code`;
      else if (text === '4') response = `CON Enter Recipient Code`;
       else {
        response = `END Invalid Input, Input Valid Between 1 and 4`;
      }
      return response;
    }
    else if(level[0] && level[0]!="" && level[1] && !level[2]){
       let response: string;
       if(level[0] == "2"){
         narration = `BEING PAYMENT MADE TO Merchant ${level[1]}`;
       }else if(level[0] == "3"){
         narration = `PAYMENT ACCEPTED BY Merchant ${level[1]}`;
       }else if(level[0] == "4"){
         narration = `DONATION TO Merchant ${level[1]}`;
       }
       const data = {
        "code":level[1]
       }
       try{
       const httpResp = await firstValueFrom(this.httpService.post(`${process.env.peopleUrl}/verify`, data));
        

        if(level[0] == "1" && httpResp.data.success){
           const balance = `GHC${Number(parseFloat(httpResp.data.data.balance)).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}`;
  
          response = `END Your Balance Is ${balance}`;
          return response;
        }


       else if((level[0] == "2" || level[0] == "3" || level[0] == "4") && httpResp.data.success){
          if(level[0] == "3"){

            response = `CON Select Network To Accept Payment ?
            1. MTN
            2. VODAFONE
            3. AIRTELTIGO
            `;

          }else{
          response = `CON Please Select Network You Are Using ?
          1. MTN
          2. VODAFONE
          3. AIRTELTIGO
          `;
          }
          return response;
       }
  
       else if(!httpResp.data.success){
        if(level[0] == "1" || level[0] == "2"  || level[0] == "3"){
          response = `END Invalid Merchant Code`;
        } else {
          response = `END Invalid Recipient Code`;
        }
  
         return response;
       }



       }catch(error) {
        return `END Server Issues`;
       }
      

    




    }




    // else if(level[0] && level[0]!="" && level[1] && level[2] && !level[3]){
    //   let response = "";


    //    const number = parseInt(level[2]);
    //    if(this.isInt(number) && number <= 3){
    //         if(level[0] == "2"){
    //        response = `CON Enter Amount To Pay`;
    //        return response;
    //     } else if(level[0] == "3"){
    //       response = `CON Enter Amount To Accept Payment`;
    //       return response;
    //     }
  
    //     else if(level[0] == "4"){
    //       response = `CON Enter Donation Amount`;
    //       return response;
    //    }
    //    } else {
    //     response = `END Invalid Selection`;
    //     return response;
    //    }

       
    // }


    // else if(level[0] && level[0]!="" && level[1] && level[2] && level[3]){
    //   let response = "";
    //    const number = parseFloat(level[3]);
    //    if(this.isInt(number) || this.isFloat(number)){
    //      if(level[0] == "2" || level[0] == "4"){
    //       // response = `END Transaction Done Successfully`;
          
    //       if(level[2] == "1"){
    //         network = "mtn";
    //       }
    //       else if(level[2] == "2"){
    //         network = "vodafone";
    //       }
    //       else if(level[2] == "3"){
    //         network = "airteltigo";
    //       }
    //       const data = {
    //         "code":level[1],
    //         "amount":level[3],
    //         "payee":phoneNumber,
    //         "issuer":network,
    //         narration
    //        }
    //       try{
    //         const httpResp = await firstValueFrom(this.httpService.post(`${process.env.peopleUrl}/payment`, data));
             
     
    //          if((level[0] == "2" || level[0] == "4") && httpResp.data.success){
       
    //            response = `END Transaction Received For Processing, Pending Authorization From You...`;
               
    //          }
    //      }catch(error){
    //          response = `END Server Issues`;
    //      }
      
    //      return response;
    //    }
    //    else {
    //     response = `END Invalid Amount Entered`;
    //   }

    //   if(level[0] == "3"){
    //     response = `CON Enter Payee Wallet Number`;
    //    }

    //    return response;

    //   }

      
      

    
    // }
  



    // else if(level[0] && level[0]!="" && level[1] && level[2] && level[3] && level[4]){
    //   let response = "";
    //   // const payee_wallet = 'P10001';

    //   if(level[0] == "3" && parseInt(level[4])){
    //     response = "END A Payment Prompt Has Been Sent Successfully";
    //     const data = {
    //       "code":level[1],
    //       "amount":level[3],
    //       "payee":level[4],
    //       "issuer":network,
    //       narration
    //      }
    //     try{
    //       const httpResp = await firstValueFrom(this.httpService.post(`${process.env.peopleUrl}/payment`, data));
           
   
    //        if(httpResp.data.success){
          
     
    //          response = `END A Payment Prompt Has Been Sent Successfully`;
             
    //        }
    //    }catch(error){
    //        response = `END Server Issues`;
    //    }
    
    //    return response;
    //   }
    //   else {
    //     response = "END Invalid Payee Wallet Number"
    //   }

    //    return response;
    // }


  }


  isInt(n){
    return Number(n) === n && n % 1 === 0;
}

 isFloat(n){
    return Number(n) === n && n % 1 !== 0;
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
