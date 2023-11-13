import { ValidationOptions, registerDecorator } from "class-validator";
import { IsUniqueConstraint } from "./is-unique-constraint";

export type IsUniqueContraintInput = {
    tableName: string;
    column:string;
    column2?:string;
}

export function IsUnique(options:IsUniqueContraintInput, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
      registerDecorator({
        name: "is-unique",
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [options],
        validator: IsUniqueConstraint,
      });
    };
  }