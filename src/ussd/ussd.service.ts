import { Injectable } from '@nestjs/common';
import { CreateUssdDto } from './dto/create-ussd.dto';
import { UpdateUssdDto } from './dto/update-ussd.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import xml2json from '@hendt/xml2json';
import * as moment from 'moment';
import { Builder, parseString } from 'xml2js';



@Injectable()
export class UssdService {

   private requestId:string;
   private sessionId:string;
   private msisdn:string;
   private starCode:string;
   private id:number;
   private rspFlag:number;
   private tagSet:string;
   private noti_message:string;
   private error_message:string;
   private session_timestamp:any;



  
   constructor(private httpService: HttpService){}

  async create(xmlData:string) {
 
    const jsonData = xml2json(xmlData);
    const {requestId,sessionId, msisdn, starCode, keyWord, featureId,dataSet, userData, timeStamp} = jsonData.USSDDynMenuRequest;

    const {sequence, intro, merchantCode, amount_trans, network_selected} = dataSet.param;
    this.requestId = requestId;
    this.sessionId = sessionId;
    this.msisdn = msisdn;
    this.starCode = starCode;


  //   <tagSet>
  //   <sequence>${sequence}</sequence>
  //   <intro>${intro}</intro>
  //   <merchantCode>${merchantCode}</merchantCode>
  //   <amount_trans>${amount_trans}</amount_trans>
  // </tagSet>
  
    //const session_timestamp = moment(t).format('Y-m-d H:i:s');
    this.session_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const phoneNumber1 = msisdn.replace(/[+-]/g, '').replace(/\s+/g, '')
    // let intro:string;
    // let sequence:string;
    // let network_selected :string;
    // let merchantCode:string;
    let narration:string;
    let network:string;
    // let amount_trans;


    if(userData === "*421#"){
      const sequencee = "1";
      this.id = 1;
      this.rspFlag = 1;
      this.noti_message = `Welcome to PeoplesPay
      1. Check Balance
      2. Make Payment
      3. Accept Payment
      4. Make a Donation`;

      this.tagSet = `
      <tagSet>
      <sequence>${sequencee}</sequence>
    </tagSet>
      `;

      // const data = this.xmlData();


      // const httpRespp = await firstValueFrom(this.httpService.post(`https://172.17.9.18`, data,{
      //   headers: { 'Content-Type': 'application/xml' },
      // }));

      //  if(httpRespp.data){
      //   return "OK";
      //  }

      // const xmlObject = await this.parseXml(this.xmlData());
      // this.removeNode(xmlObject, "xml");
      // return this.buildXml(xmlObject);
      return this.xmlData();
     // return 

     // return this.xmlData();
    }

    else if((userData == "1" || userData == "2" || userData == "3" || userData == "4" || parseInt(userData) > 4) && sequence == "1") {
      const introo = userData;
      const sequencee = "2";

      this.id = 2;
      this.rspFlag = 1;
      this.tagSet = `
      <tagSet>
      <sequence>${sequencee}</sequence>
      <intro>${introo}</intro>
    </tagSet>
      `;


      if(userData === '1' || userData === '3')
      {
        this.noti_message = "Enter Your Merchant Code";
      }else if (userData === '2') {
        this.noti_message = "Enter The Merchant Code";
      }else if(userData === "4"){
        this.noti_message = "Enter Recipient Code";
      }
   
       else {
        this.error_message = "Invalid Choice";
        return this.xmlError();
      }

      // const data = this.xmlData();


      // const httpRespp = await firstValueFrom(this.httpService.post(`https://172.17.9.18`, data,{
      //   headers: { 'Content-Type': 'application/xml' },
      // }));

      //  if(httpRespp.data){
      //   return "OK";
      //  }
      // const xmlObject = await this.parseXml(this.xmlData());
      // this.removeNode(xmlObject, "<xml>");
      // return this.buildXml(xmlObject);
      return this.xmlData();
      //return 
    }  
    
    
    else if(userData && sequence == "2") {
      const merchantCodee = userData;
      const sequencee = "3";


      this.id = 3;
      this.rspFlag = 1;
      this.tagSet = `<tagSet>
      <sequence>${sequencee}</sequence>
      <intro>${intro}</intro>
      <merchantCode>${merchantCodee}</merchantCode>
    </tagSet>
      `;

 
  
      const data = {
       "code":userData
      }
      try{
      const httpResp = await firstValueFrom(this.httpService.post(`https://peoplespay.com.gh/api/checkout/verify`, data));
       

       if(intro == "1" && httpResp.data.success){
          const balance = `GHC${Number(parseFloat(httpResp.data.data.balance)).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}`;
         
          this.rspFlag = 2;
          this.tagSet = "";
          this.noti_message = `Merchant Balance Is ${balance}`;

         return this.xmlData();
       }

     
      else if((intro == "2" || intro == "3" || intro == "4") && httpResp.data.success){
         if(intro == "3"){

          this.noti_message = `Select Network To Accept Payment ?
          1. MTN
          2. VODAFONE
          3. AIRTELTIGO`;

          return this.xmlData();

         }else{

          this.noti_message = `Please Select Network You Are Using ?
          1. MTN
          2. VODAFONE
          3. AIRTELTIGO`

        return this.xmlData();
         }
      }
 
      else if(!httpResp.data.success){
       if(intro == "1" || intro == "2"  || intro == "3"){

        this.error_message = "Invalid Merchant Code";
        return this.xmlError();

       } else {

        this.error_message = "Invalid Recipient Code";
        return this.xmlError();
  
       }
 
      }



      }catch(error) {

        this.error_message = "Server Issues";
        return this.xmlError();

      }
     

   }


   else if(sequence == "3"){
    const network_selectede = userData 

    const sequencee = "4";

    this.id = 4;
    this.rspFlag = 1;
    this.tagSet = `<tagSet>
    <sequence>${sequencee}</sequence>
    <intro>${intro}</intro>
    <merchantCode>${merchantCode}</merchantCode>
    <network_selected>${network_selectede}</network_selected>
  </tagSet>
    `;



    // const number = parseInt(level[2]);
     if(intro == "1" || intro == "2" || intro == "3" || intro == "4"){
          if(intro === "2"){
            this.noti_message = "Enter Amount To Pay";
            return this.xmlData();
      } else if(intro === "3"){
        this.noti_message = "Enter Amount To Pay";
        return this.xmlData();
      }

      else if(intro === "4"){
        this.noti_message = "Enter Donation Amount";
        return this.xmlData();  
     }
     } else {
      this.error_message = "Invalid Selection";
      return this.xmlError();

     }

     
  }

  else if(sequence == "4"){
    const sequencee = "5";
    const amount_transe = parseFloat(userData);
     const number = parseFloat(userData);

     this.id = 5;
     this.rspFlag = 1;
     this.tagSet = `<tagSet>
     <sequence>${sequencee}</sequence>
     <intro>${intro}</intro>
     <merchantCode>${merchantCode}</merchantCode>
     <network_selected>${network_selected}</network_selected>
     <amount_trans>${amount_transe}</amount_trans>
   </tagSet>
     `;






     if(intro == "2"){
      this.noti_message = `BEING PAYMENT MADE TO Merchant ${merchantCode}`;
    }else if(intro == "3"){
      this.noti_message = `PAYMENT ACCEPTED BY Merchant ${merchantCode}`;
    }else if(intro == "4"){
      this.noti_message = `DONATION TO Merchant ${merchantCode}`;
    }
     if(this.isInt(number) || this.isFloat(number)){
       if(intro == "2" || intro == "4"){
        // response = `END Transaction Done Successfully`;
        
        if(network_selected == "1"){
          network = "mtn";
        }
        else if(network_selected == "2"){
          network = "vodafone";
        }
        else if(network_selected == "3"){
          network = "airteltigo";
        }
        const data = {
          "code":merchantCode,
          "amount":userData,
          "payee":phoneNumber1,
          "issuer":network,
          narration
         }
        try{
          const httpResp = await firstValueFrom(this.httpService.post(`${process.env.peopleUrl}/payment`, data));
           
   
           if((intro == "2" || intro == "4") && httpResp.data.success){

            if(httpResp.data.success){
     
            this.rspFlag = 2;
            this.tagSet = "";
            this.noti_message = "Transaction Received For Processing, Pending Authorization From You...";
            return this.xmlData();
            }

        
             
           }
       }catch(error){
        this.error_message = "Server Issues";
        return this.xmlError();
  
       }
    
     }
     else if(intro == "3"){
      this.noti_message = "Enter Wallet Payee Number";
      return this.xmlData();
      
     }
  

    }   else {
      this.error_message = "Invalid Amount Entered";
      return this.xmlError();

    }


    
    

  
  }


  else if(sequence == "5"){
    const sequencee = "6";
    // const payee_wallet = 'P10001';

    this.id = 6;
    this.rspFlag = 1;
    this.tagSet = `<tagSet>
    <sequence>${sequencee}</sequence>
    <intro>${intro}</intro>
    <merchantCode>${merchantCode}</merchantCode>
    <network_selected>${network_selected}</network_selected>
    <amount_trans>${amount_trans}</amount_trans>
  </tagSet>
    `;
    const narration = `PAYMENT ACCEPTED BY Merchant ${merchantCode}`;


    if(intro == "3"){
      // response = "END A Payment Prompt Has Been Sent Successfully";
       
        this.noti_message = `A Payment Prompt Has Been Sent Successfully`;

     
       this.rspFlag = 2;
       this.tagSet = ""

       
       if(network_selected == "1"){
        network = "mtn";
      }
      else if(network_selected == "2"){
        network = "vodafone";
      }
      else if(network_selected == "3"){
        network = "airteltigo";
      }
      const data = {
        "code":merchantCode,
        "amount":amount_trans,
        "payee":userData,
        "issuer":network,
        narration
       }
      try{
        const httpResp = await firstValueFrom(this.httpService.post(`${process.env.peopleUrl}/payment`, data));
         
 
         if(httpResp.data.success){
        
   
          return this.xmlData();
           
         }else {

          this.error_message = "Transaction Did Not Go Through";
          return this.xmlError();

         }
     }catch(error){

      this.error_message = "Server Issues";
      return this.xmlError();
     }
  
    }
    else {

      this.error_message = "Invalid Payee Wallet Number";
      return this.xmlError();

    }

  }
    

  }


  isInt(n){
    return Number(n) === n && n % 1 === 0;
}

 isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

  xmlData() {
    return `<USSDDynMenuResponse>
   <requestId>${this.requestId}</requestId>
   <sessionId>${this.sessionId}</sessionId>
   <msisdn>${this.msisdn}</msisdn>
   <starCode>${this.starCode}</starCode>                    
   <dataSet>
       <param>
           <id>${this.id}</id>
           <value>${this.noti_message}</value>
           <rspFlag>${this.rspFlag}</rspFlag>
           <default>1</default>
           <appendIndex>0</appendIndex>
           ${this.tagSet}
       </param>
   </dataset>
   <ErrCode>1</ErrCode>
   <timeStamp>${this.session_timestamp}</timeStamp>
   <langId>1</langId>
   <encodingScheme>0</encodingScheme>
</USSDDynMenuResponse>`;
  }


  xmlError(){
    return `<USSDError>
         <requestid>${this.requestId}</requestId>
         <errorCode>112</errorCode>
         <responseFlag>Y</responseFlag>
         <userData>${this.error_message}</userData>
         </USSDError>`;
  }




  private parseXml(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  private removeNode(xmlObject: any, nodeName: string): void {
    delete xmlObject[nodeName];
  }


  private buildXml(xmlObject: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const builder = new Builder();
      const xml = builder.buildObject(xmlObject);
      resolve(xml);
    });
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
