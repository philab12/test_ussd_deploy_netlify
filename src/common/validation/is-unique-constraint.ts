import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { IsUniqueContraintInput } from "./is-unique";
import { EntityManager } from "typeorm";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({name: "IsUniqueConstraint", async: true})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {

    constructor(private readonly entityManager: EntityManager){}


    async validate(value: any, args?: ValidationArguments): Promise<boolean> {
        const {tableName, column, column2} : IsUniqueContraintInput = args.constraints[0];
       let exists;
        if(column2 === null)
        {
           exists = await this.entityManager.getRepository(tableName)
                                             .createQueryBuilder(tableName)
                                             .where({[column]: value})
                                             .getExists();
        } else{
            exists = await this.entityManager.getRepository(tableName)
            .createQueryBuilder(tableName)
            .where({[column]: value})
            .getExists();
        }


       return exists ? false : true;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return "This Record Already Exist";
    }
    
}